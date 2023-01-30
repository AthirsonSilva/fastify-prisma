import { FastifyReply, FastifyRequest } from 'fastify'
import { server } from '../../app'
import { verifyPassword } from '../../utils/hash'
import { CreateUserInput, LoginRequest } from './user.schema'
import { createUser, findUserByEmail, findUsers } from './user.service'

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
	} catch (error: any) {
		return reply.code(500).send({ error: error.message })
	}
}

export async function loginHandler(
	request: FastifyRequest<{
		Body: LoginRequest
	}>,
	reply: FastifyReply
) {
	const body = request.body

	const user = await findUserByEmail(body.email)

	if (!user) {
		return reply
			.code(401)
			.send({ message: 'User not found. Invalid email or password.' })
	}

	const correctPassword = verifyPassword({
		candidatePassword: body.password,
		salt: user.salt,
		hash: user.password
	})

	if (correctPassword) {
		const { password, salt, ...rest } = user

		return reply.code(201).send({
			message: 'User logged in successfully',
			accessToken: server.jwt.sign(rest)
		})
	}

	return reply.code(401).send({ message: 'Invalid email or password.' })
}

export async function getUsersHandler(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const token = request.headers.authorization as string

	const decoded = server.jwt.verify(token.split(' ')[1])

	if (!decoded) {
		return reply.code(401).send({ message: 'Unauthorized' })
	}

	const users = await findUsers()

	return reply.code(200).send({
		message: 'Users fetched successfully',
		users
	})
}
