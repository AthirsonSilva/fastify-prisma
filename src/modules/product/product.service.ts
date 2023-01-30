import prisma from '../../utils/prisma'
import { CreateProductInput } from './product.schema'

export async function createProduct(
	data: CreateProductInput & { ownerId: number }
) {
	const { ownerId, ...rest } = data

	return prisma.product.create({
		data: {
			...rest,
			owner: {
				connect: {
					id: ownerId
				}
			}
		}
	})
}

export async function getProducts() {
	return prisma.product.findMany({
		select: {
			id: true,
			price: true,
			title: true,
			owner: {
				select: {
					id: true,
					name: true,
					email: true
				}
			}
		}
	})
}
