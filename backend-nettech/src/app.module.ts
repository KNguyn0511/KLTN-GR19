import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { SalesModule } from './sales/sales.module';
import { BranchesModule } from './branches/branches.module';
import { CartModule } from './cart/cart.module';
import { StockManagementModule } from './stock-management/stock-management.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    UsersModule,
    SalesModule,
    BranchesModule,        // Module quản lý danh sách chi nhánh cửa hàng
    CartModule,            // Module quản lý giỏ hàng của người dùng
    StockManagementModule, // Module quản lý kho: phiếu yêu cầu & chuyển hàng
  ],
})
export class AppModule {}
