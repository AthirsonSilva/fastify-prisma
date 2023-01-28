import Fastify from 'fastify'
import userRoutes from './modules/users/user.routes'
import { userSchemas } from './modules/users/user.schema'

const server = Fastify()

server.get('/health', async (request, reply) => {
	return {
		status: 'OK',
		message: 'The server is up and running',
		timestamp: new Date().toISOString()
	}
})

async function main() {
	for (const schema of userSchemas) {
		server.addSchema(schema)
	}

	server.register(userRoutes, { prefix: '/api/users' })

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
