import { FastifyInstance, FastifyRequest, FastifyReply } from "@ayazmo/core"
import { AyazmoRouteOptions } from '@ayazmo/types';
import { AyazmoError } from '@ayazmo/utils';

interface CredentialsBody {
  username: string;
  password: string;
}

interface Invite {
  email: string
}

interface Check {
  check: string
}

interface Register {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
}

const routes = (app: FastifyInstance): AyazmoRouteOptions[] => [
  {
    method: 'POST',
    url: '/admin/login',
    schema: {
      body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 }
        }
      }
    },
    handler: async (request: FastifyRequest<{ Body: CredentialsBody }>, reply: FastifyReply) => {
      const { username, password } = request.body;
      const adminService = request.diScope.resolve('adminService');
      const admin = await adminService.login(username, password)

      if (!admin) {
        throw AyazmoError({
          statusCode: 401,
          message: 'Email or password incorrect.',
          code: 'UNAUTHENTICATED'
        });
      }

      return reply.code(200).send({ admin });
    }
  },
  {
    method: 'POST',
    url: '/admin/invite/create',
    schema: {
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' },
        }
      }
    },
    handler: async (request: FastifyRequest<{ Body: Invite }>, reply) => {
      const { email } = request.body;
      const adminInviteService = request.diScope.resolve('adminInviteService')
      await adminInviteService.createInvite(email)

      reply.code(200).send({ message: 'Admin invite sent' })
    }
  },
  {
    method: 'POST',
    url: '/admin/setup',
    schema: {
      body: {
        type: 'object',
        properties: {
          check: { type: 'string' }
        }
      }
    },
    handler: async (request: FastifyRequest<{ Body: Check }>, reply) => {
      const { check } = request.body

      if (!check) {
        throw AyazmoError({
          statusCode: 404,
          message: 'Not found',
          code: 'NOT_FOUND'
        });
      }

      const adminService = request.diScope.resolve('adminService')
      const adminInviteService = request.diScope.resolve('adminInviteService')
      const [admins, invites] = await Promise.all([
        adminService.count(),
        adminInviteService.count({})
      ])

      if (admins > 0 || invites > 0) {
        throw AyazmoError({
          statusCode: 404,
          message: 'Not found',
          code: 'NOT_FOUND'
        });
      }

      await adminInviteService.createInvite()

      reply.code(200).send({ allowed: true })
    }
  },
  {
    method: 'POST',
    url: '/admin/register',
    schema: {
      body: {
        type: 'object',
        properties: {
          username: { type: 'string', format: 'email' },
          password: { type: 'string' },
          first_name: { type: 'string' },
          last_name: { type: 'string' }
        }
      }
    },
    handler: async (request: FastifyRequest<{ Body: Register }>, reply) => {
      const { username, password, first_name, last_name } = request.body

      const adminService = request.diScope.resolve('adminService')
      const adminInviteService = request.diScope.resolve('adminInviteService')
      const [admins, invites] = await Promise.all([
        adminService.count(),
        adminInviteService.count({})
      ])

      if (admins > 0 || invites > 0) {
        throw AyazmoError({
          statusCode: 404,
          message: 'Not found',
          code: 'NOT_FOUND'
        });
      }

      await adminService.create(
        username,
        password,
        first_name,
        last_name
      )

      reply.code(200).send({ allowed: true })
    }
  }
]

export default routes;