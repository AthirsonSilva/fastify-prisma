import { hashPassword } from '../../utils/hash'
import prisma from '../../utils/prisma'
import { CreateUserInput } from './user.schema'

export async function createUser(input: CreateUserInput) {
	try {
		const { password, ...rest } = input

		const { hash, salt } = hashPassword(password as string)

		const user = await prisma.user.create({
			data: { ...rest, salt, password: hash }
		})

		return user
	} catch (error) {
		throw new Error(error.message)
	}
}

export async function findUserByEmail(email: string) {
	return prisma.user.findUnique({ where: { email } })
}
