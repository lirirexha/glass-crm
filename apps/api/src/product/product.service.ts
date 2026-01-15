import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateProductDto } from './dto/create-product.dto'

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
}
