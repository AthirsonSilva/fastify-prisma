import { buildJsonSchemas } from 'fastify-zod'
import * as z from 'zod'

const userCore = {
	email: z
		.string({
			required_error: 'Email is required',
			invalid_type_error: 'Email must be a string'
		})
		.email(),
	name: z.string()
}

const createUserSchema = z.object({
	...userCore,
	password: z.string({
		required_error: 'Password is required',
		invalid_type_error: 'Password must be a string'
	})
})

const createUserResponseSchema = z.object({
	id: z.number(),
	...userCore
})

const loginSchema = z.object({
	email: z.string({
		required_error: 'Email is required',
		invalid_type_error: 'Email must be a string'
	}),
	password: z.string({
		required_error: 'Password is required',
		invalid_type_error: 'Password must be a string'
	})
})

const loginResponseSchema = z.object({
	accessToken: z.string()
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type LoginRequest = z.infer<typeof loginSchema>

const userModels = {
	createUserSchema,
	createUserResponseSchema,
	loginSchema,
	loginResponseSchema
}

export const { schemas: userSchemas, $ref } = buildJsonSchemas(userModels, {
	$id: 'user'
})
