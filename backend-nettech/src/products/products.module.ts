import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { ProductSchema } from './schemas/product.schema';
import { ProductItemSchema } from './schemas/product-item.schema';

@Module({
  imports: [
    // Khai báo các Model vào Module cho Mongoose xài
    MongooseModule.forFeature([
      { name: 'Product', schema: ProductSchema },
      { name: 'ProductItem', schema: ProductItemSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsRepository, // Nhớ thêm Repository vào providers để Service dùng được
  ],
  exports: [ProductsService], // Export nếu sau này Module khác cần dùng tới Products
})
export class ProductsModule {}
