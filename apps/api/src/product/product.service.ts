import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateProductDto, UpdateProductDto, ListProductsQuery } from './dto/types'

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) { }


  async list(companyId: number, query: ListProductsQuery) {
    const offset = query.offset ?? 0
    const limit = query.limit ?? 20

    const where = {
      companyId,
      isActive: true,
    }

    const total = await this.prisma.product.count({where})

    const data = await this.prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    })

    return {
      data,
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + data.length < total,
      },
    }
  }

  async create(companyId: number, data: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        companyId,
        name: data.name,
        description: data.description,
        price: data.price,
        isActive: data.isActive ?? true,
      },
    })
  }

  async update(companyId: number, id: number, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findFirst({
      where: { id, companyId },
      select: { id: true },
    })

    if (!existing) throw new Error('Product not found')

    return this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.price !== undefined ? { price: dto.price } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
    })
  }

  // duplicate of list(), just in case we want to change smth later - eg return fewer data
  async listPublic(
    companyId: number,
    query: { offset?: number; limit?: number }
  ) {
    const offset = query.offset ?? 0
    const limit = query.limit ?? 20

    const where = { companyId, isActive: true }

    const total = await this.prisma.product.count({where})

      const data = await this.prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      })

    return {
      data,
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + data.length < total,
      },
    }
  }
}
