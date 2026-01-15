import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ProductService } from './product.service'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { Role } from '@prisma/client'
import { CreateProductDto } from './dto/create-product.dto'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { CurrentUserPayload } from '../auth/decorators/current-user.decorator'

@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get()
  list(@CurrentUser() user: CurrentUserPayload) {
    return this.service.list(user.companyId)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() data: CreateProductDto
  ) {
    return this.service.create(user.companyId, data)
  }
}
