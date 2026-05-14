import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WarrantyService } from './warranty.service';
import { WarrantyController } from './warranty.controller';
import { Warranty, WarrantySchema } from './schemas/warranty.schema';
import { Order, OrderSchema } from '../sales/schemas/order.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Warranty.name, schema: WarrantySchema },
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    NotificationsModule,
  ],
  controllers: [WarrantyController],
  providers: [WarrantyService],
  exports: [WarrantyService],
})
export class WarrantyModule {}
