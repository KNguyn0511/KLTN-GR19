import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SepayController } from './sepay.controller';
import { SepayService } from './sepay.service';
import { SalesModule } from '../sales/sales.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    ConfigModule,
    SalesModule,
    TransactionsModule,
  ],
  controllers: [SepayController],
  providers: [SepayService],
})
export class SepayModule {}
