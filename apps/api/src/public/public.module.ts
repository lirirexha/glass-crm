import { Module } from '@nestjs/common'
import { PublicController } from './public.controller'
import { ProductService } from '../product/product.service'

@Module({
    controllers: [PublicController],
    providers: [ProductService],
})
export class PublicModule {}
