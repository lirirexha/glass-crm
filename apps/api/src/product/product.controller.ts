import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Patch,
  Param,
  ParseIntPipe,
  Query
} from '@nestjs/common'
import { ProductService } from './product.service'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { Role } from '@prisma/client'
import { CreateProductDto, UpdateProductDto, ListProductsQuery } from './dto/types'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { CurrentUserPayload } from '../auth/decorators/current-user.decorator'

@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get()
  list(@CurrentUser() user: CurrentUserPayload, @Query() query: ListProductsQuery) {
    return this.service.list(user.companyId, query)
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

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto
  ) {
    return this.service.update(user.companyId, id, dto)
  }
}
