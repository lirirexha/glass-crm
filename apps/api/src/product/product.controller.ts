import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import type { Request } from 'express'
import { ProductService } from './product.service'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { Role } from '@prisma/client'

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
  @Get('admin-check')
  adminCheck() {
    return { ok: true }
  }
}
