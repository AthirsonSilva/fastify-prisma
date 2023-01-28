import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateUserInput } from './user.schema'
import { createUser } from './user.service'

export async function registerUserHandler(
	request: FastifyRequest<{
		Body: CreateUserInput
	}>,
	reply: FastifyReply
) {
	const body = request.body

	try {
		const user = await createUser(body)

		return reply.code(201).send({
			message: 'User created successfully',
			user: {
				id: user.id,
				email: user.email,
				name: user.name
			}
		})
	} catch (error) {
		return reply.code(500).send({ error: error.message })
	}
}
