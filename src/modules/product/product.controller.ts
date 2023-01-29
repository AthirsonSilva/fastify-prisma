import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateProductInput } from './product.schema'
import { createProduct } from './product.service'

export async function createProductHandler(
	request: FastifyRequest<{
		Body: CreateProductInput
		Headers: { authorization: number }
	}>,
	reply: FastifyReply
) {
	try {
		const product = await createProduct({
			...request.body,
			ownerId: request.headers.authorization
		})
	} catch (error) {
		console.error(error)
		reply.status(500).send({ error: error.message })
	}
}
