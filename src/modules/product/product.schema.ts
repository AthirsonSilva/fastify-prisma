import { buildJsonSchemas } from 'fastify-zod'
import { z } from 'zod'

const productInput = {
	title: z.string(),
	price: z.number(),
	content: z.string().optional()
}

const productGenerated = {
	id: z.number(),
	createdAt: z.string(),
	updatedAt: z.string()
}

const createProductSchema = z.object({
	...productInput
})

const productResponseSchema = z.object({
	...productInput,
	...productGenerated
})

const productsResponseSchema = z.array(productResponseSchema)

export type CreateProductInput = z.infer<typeof createProductSchema>

export const productModels = {
	createProduct: createProductSchema,
	product: productResponseSchema,
	products: productsResponseSchema
}

export const { schemas: productSchemas, $ref } = buildJsonSchemas(
	productModels,
	{
		$id: 'product'
	}
)
