import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  list(companyId: number) {
    return this.prisma.product.findMany({
      where: { companyId, isActive: true },
        //TODO: To be discussed
      orderBy: { createdAt: 'desc' },
    })
  }
}
