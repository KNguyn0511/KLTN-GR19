import { Controller, Post, Body, Req, UseGuards, Patch, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { SalesService } from './sales.service';
import { OptionalJwtAuthGuard } from '../users/guards/auth.guard';

@ApiTags('Sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post('checkout')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Đặt hàng',
  })
  async checkout(
    @Req() req: Request & { user?: { id?: string; sub?: string } },
    @Body() checkoutData: Record<string, unknown>,
  ) {
    const jwtId = req.user?.id ?? req.user?.sub;
    const bodyId = (checkoutData as { userId?: string }).userId;
    const userId =
      jwtId !== undefined && String(jwtId).trim() !== ''
        ? String(jwtId)
        : bodyId !== undefined && String(bodyId).trim() !== ''
          ? String(bodyId)
          : '';
    return await this.salesService.checkout(userId, checkoutData);
  }

  @Post('pack-order')
  async packOrder(@Body() body: { orderId: string, items: { productId: string, serialNumbers: string[] }[] }) {
    return await this.salesService.packOrder(body.orderId, body);
  }

  @Post('ship-order')
  async shipOrder(@Body() body: { orderId: string, carrier: string }) {
    return await this.salesService.shipOrder(body.orderId, body.carrier);
  }

  @Post('complete-order')
  async completeOrder(@Body() body: { orderId: string, force?: boolean }) {
    return await this.salesService.completeOrder(body.orderId, body.force);
  }

  @Post('ghn-webhook')
  async ghnWebhook(@Body() body: any) {
    console.log('--- RECEIVED GHN WEBHOOK ---');
    console.log(JSON.stringify(body, null, 2));
    return await this.salesService.handleGHNWebhook(body);
  }

  @Post('sync-all-orders')
  async syncAllOrders() {
    return await this.salesService.syncAllOrdersWithGHN();
  }
}
