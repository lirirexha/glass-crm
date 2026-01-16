import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'

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