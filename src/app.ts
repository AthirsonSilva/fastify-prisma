import jwt, { JWT } from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { withRefResolver } from 'fastify-zod'
import { version } from '../package.json'
import productRoutes from './modules/product/product.routes'
import { productSchemas } from './modules/product/product.schema'
import userRoutes from './modules/users/user.routes'
import { userSchemas } from './modules/users/user.schema'

declare module 'fastify' {
	interface FastifyRequest {
		jwt: JWT
		user: {
			id: number
			email: string
			name: string
		}
	}
	export interface FastifyInstance {
		authenticate: any
	}
}

declare module '@fastify/jwt' {
	interface FastifyJWT {
		user: {
			id: number
			email: string
			name: string
		}
	}
}

export const server = Fastify()

server.register(jwt, {
	secret: 'supersecret'
})

server.decorate(
	'authenticate',
	async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			await request.jwtVerify()
		} catch (error: any) {
			return reply.send({
				message: 'Authentication failed: ' + error.message
			})
		}
	}
)

server.get('/health', async (request, reply) => {
	return {
		status: 'OK',
		message: 'The server is up and running',
		timestamp: new Date().toISOString()
	}
})

async function main() {
	for (const schema of [...userSchemas, ...productSchemas]) {
		server.addSchema({
			...schema,
			$id: schema.$id
		})
	}

	server.register(
		fastifySwagger,
		withRefResolver({
			routePrefix: '/docs',
			exposeRoute: true,
			staticCSP: true,
			swagger: {
				info: {
					title: 'Fastify API',
					description:
						'Building a blazing fast REST API with Node.js, MongoDB, Fastify, Prisma.io and Swagger',
					version
				}
			},
			openapi: {
				info: {
					title: 'Fastify API',
					description:
						'Building a blazing fast REST API with Node.js, MongoDB, Fastify, Prisma.io and Swagger',
					version
				}
			}
		})
	)

	server.register(userRoutes, { prefix: '/api/users' })
	server.register(productRoutes, { prefix: '/api/products' })

	try {
		await server.listen({ port: 3000, host: '0.0.0.0' })
		const address = server.server.address() as { port: number }

		console.log(`Server listening on ${address.port || address}`)
	} catch (error) {
		server.log.error(error)
		process.exit(1)
	}
}

main()
