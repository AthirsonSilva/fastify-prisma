import { FastifyReply, FastifyRequest } from 'fastify'
import { server } from '../../app'
import { CreateProductInput } from './product.schema'
import { createProduct, getProducts } from './product.service'

export async function createProductHandler(
	request: FastifyRequest<{
		Body: CreateProductInput
		Headers: { authorization: number }
	}>,
	reply: FastifyReply
) {
	try {
		const token = request.headers.authorization as string

		if (!token) return reply.status(401).send({ message: 'Unauthorized' })

		const decoded = server.jwt.verify(token.split(' ')[1]) as any
		const ownerId = decoded?.id

		if (!decoded) return reply.status(401).send({ message: 'Unauthorized' })

		const product = await createProduct({
			...request.body,
			ownerId: parseInt(ownerId)
		})

		return reply.status(201).send({
			message: 'Product created successfully',
			product
		})
	} catch (error) {
		console.error(error)
		reply.status(500).send({ error: error.message })
	}
}

export async function getProductsHandler(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		const products = await getProducts()

		return reply.status(200).send({
			message: 'Products fetched successfully',
			products
		})
	} catch (error) {}
}
