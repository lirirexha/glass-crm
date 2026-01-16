import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateProductDto, UpdateProductDto } from './dto/types'

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) { }

  list(companyId: number) {
    return this.prisma.product.findMany({
      where: { companyId, isActive: true },
      orderBy: { createdAt: 'desc' },
    })
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
}
