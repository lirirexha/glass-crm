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

  async create(companyId: number, dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        companyId,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        isActive: dto.isActive ?? true,
      },
    })
  }
}
