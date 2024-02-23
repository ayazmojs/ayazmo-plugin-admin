import { exec } from 'child_process';
import path, { dirname } from 'node:path';
import fs from 'node:fs'
import { fileURLToPath } from 'node:url';
import { AyazmoError, mergeFolders, getRegisteredPlugins } from '@ayazmo/utils';
import { getPluginRoot, loadRoutes, FastifyInstance, FastifyRequest, cors } from "@ayazmo/core";
import { PluginConfig } from '@ayazmo/types'
import { decode, JWT, Secret } from 'next-auth/jwt';

interface ExtendedAdmin extends JWT {
  [key: string]: any;
}

declare module "@ayazmo/core" {
  interface FastifyRequest {
    admin?: ExtendedAdmin
  }

  interface FastifyInstance {
    adminAuthStrategy: (request: FastifyRequest) => Promise<JWT>;
  }
}

declare module "@ayazmo/types" {
  interface PluginConfig {
    secretKey: Secret;
  }
}

export default async (app: FastifyInstance, container: any, pluginConfig: PluginConfig) => {

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  let navigation: any[] = [];

  app.decorateRequest('admin', null);

  app.decorate('adminAuthStrategy', async (request: FastifyRequest): Promise<JWT> => {
    try {
      const sessionToken = request.cookies['next-auth.session-token'];
      const secret = process.env.NEXTAUTH_SECRET;

      if (!secret || !sessionToken) {
        app.log.error('Environment variable NEXTAUTH_SECRET is not set');

        throw AyazmoError({
          statusCode: 401,
          message: 'Unauthenticated',
          code: 'UNAUTHENTICATED'
        });
      }

      const decoded = await decode({
        token: sessionToken,
        secret: secret
      });

      if (!decoded) {
        throw AyazmoError({
          statusCode: 401,
          message: 'Unauthenticated',
          code: 'UNAUTHENTICATED'
        });
      }

      return decoded;

    } catch (error) {
      app.log.error(error)

      throw AyazmoError({
        statusCode: 401,
        message: 'Unauthenticated',
        code: 'UNAUTHENTICATED'
      });
    }
  });

  app.addHook('preHandler', async (request: FastifyRequest) => {
    const requestPath = request.routeOptions.url ?? ''
    const isProtectedRoute = requestPath.startsWith('/admin') && !requestPath.startsWith('/admin/login');

    if (isProtectedRoute) {
      try {
        const admin = await app.adminAuthStrategy(request);
        request.admin = admin;
      } catch (error) {
        throw AyazmoError({
          statusCode: 401,
          message: 'Unauthenticated',
          code: 'UNAUTHENTICATED'
        });
      }
    }
  })

  // register CORS
  app.register(async (instance) => {
    instance.register(cors, {
      ...{
        hook: 'preHandler',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
      ...pluginConfig.settings.cors
    });
  }, { prefix: '/admin' })

  const plugins = await getRegisteredPlugins();
  let adminPluginPath: string = getPluginRoot(pluginConfig.name, pluginConfig.settings);

  for (const plugin of plugins) {

    const pluginAdminRoot = path.join(getPluginRoot(plugin.name, plugin.settings), 'src', 'admin')
    const pluginAdminRootNavigation = path.join(pluginAdminRoot, 'config', 'navigation.json')

    // import admin navigation
    if (fs.existsSync(pluginAdminRootNavigation)) {
      const items = await import(pluginAdminRootNavigation, {
        assert: { type: 'json' }
      })
      navigation = [...navigation, ...items.default]
    }

    // if plugin is admin -> skip
    if (plugin.name === pluginConfig.name) {
      continue;
    }

    // load admin routes
    await loadRoutes(app, container, path.join(getPluginRoot(plugin.name, plugin.settings), 'dist', 'admin', 'routes.js'), plugin.settings);
    const mergeConfig = {
      recursive: true,
      override: true,
      fileTypes: ['js', 'jsx', 'tsx']
    }

    await Promise.all([
      mergeFolders(
        path.join(pluginAdminRoot, 'app'),
        path.join(adminPluginPath, 'app'),
        mergeConfig
      ),
      mergeFolders(
        path.join(pluginAdminRoot, 'components'),
        path.join(adminPluginPath, 'components'),
        mergeConfig
      )
    ])
  }

  fs.writeFileSync(path.join(adminPluginPath, 'lib', 'navigation.json'), `${JSON.stringify(navigation, null, 2)};`, 'utf-8')

  const nextAppDir = path.join(__dirname, '..');

  // Spawn the Next.js process
  const command = process.env.NODE_ENV !== 'production' ? 'npm run dev' : 'npm run start'
  const nextProcess = exec(command, { cwd: nextAppDir }, (error, stdout, stderr) => {
    if (error) {
      app.log.error(`exec error: ${error}`);
      return;
    }
    stdout && app.log.info(`stdout: ${stdout}`);
    stderr && app.log.error(`stderr: ${stderr}`);
  });

  nextProcess.stdout?.on('data', (data) => {
    if (data?.trim()) {
      app.log.info(`Admin INFO: ${data}`);
    }
  });

  nextProcess.stderr?.on('data', (data) => {
    if (data?.trim()) {
      app.log.error(`Admin ERROR: ${data}`);
    }
  });

  nextProcess.on('exit', (code) => {
    app.log.info(`Admin process exited with code ${code}`);
    // @ts-ignore
    app.log.flush()
  });
}