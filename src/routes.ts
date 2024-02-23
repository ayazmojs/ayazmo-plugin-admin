import { FastifyInstance, FastifyRequest, FastifyReply } from "@ayazmo/core"
import { AyazmoRouteOptions } from '@ayazmo/types';
import { AyazmoError } from '@ayazmo/utils';

interface LoginBody {
  username: string;
  password: string;
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
    handler: async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
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
  }
]

export default routes;