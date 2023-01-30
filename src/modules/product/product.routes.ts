import { FastifyInstance } from 'fastify'
import { createProductHandler, getProductsHandler } from './product.controller'

async function productRoutes(server: FastifyInstance) {
	server.get(
		'/',
		{
			preHandler: [server.authenticate],
			schema: {
				tags: ['Product'],
				summary: 'Get all products',
				response: {
					200: {
						type: 'object',
						properties: {
							message: { type: 'string' },
							products: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										id: { type: 'number' },
										title: { type: 'string' },
										price: { type: 'number' },
										owner: {
											type: 'object',
											properties: {
												id: { type: 'number' },
												name: { type: 'string' },
												email: { type: 'string' }
											}
										}
									}
								}
							}
						}
					}
				}
			}
		},
		getProductsHandler
	)
	server.post('/', createProductHandler)
}

export default productRoutes
