import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  Max,
  IsInt
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateProductDto {
  @IsString()
  @MaxLength(120)
  name!: string

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string

  @IsNumber()
  @Min(0)
  price!: number

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}

export class ListProductsQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  active?: boolean
}
