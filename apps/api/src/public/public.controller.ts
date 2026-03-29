import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { Public } from '../auth/decorators/public.decorator'
import { ProductService } from '../product/product.service'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

class PublicProductsQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20
}

@Public()
@Controller('public')
export class PublicController {
  constructor(private readonly products: ProductService) {}

  // TODO: to be discussed if we want a public endpoint for products
  @Get('companies/:companyId/products')
  listCompanyProducts(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Query() query: PublicProductsQuery
  ) {
    return this.products.listPublic(companyId, query)
  }
}
