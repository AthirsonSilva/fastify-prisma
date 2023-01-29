import jwt, { JWT } from '@fastify/jwt'
import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
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
		} catch (error) {
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
	for (const userSchema of [...userSchemas]) {
		server.addSchema({
			...userSchema,
			$id: 'user'
		})
	}

	for (const productSchema of [...productSchemas]) {
		server.addSchema({
			...productSchema,
			$id: 'product'
		})
	}

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
