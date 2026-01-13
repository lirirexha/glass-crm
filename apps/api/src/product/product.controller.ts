import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import type { Request } from 'express'
import { ProductService } from './product.service'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { Role } from '@prisma/client'
import { CreateProductDto } from './dto/create-product.dto'

@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get()
  list(@Req() req: Request) {
    const user = (req as any).user as { companyId: number }
    return this.service.list(user.companyId)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Req() req: Request, @Body() dto: CreateProductDto) {
    const user = (req as any).user as { companyId: number }
    return this.service.create(user.companyId, dto)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin-check')
  adminCheck() {
    return { ok: true }
  }
}
