import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { AuthGuard } from '../users/guards/auth.guard';
import { AdminDashboardGuard } from '../dashboard/guards/admin-dashboard.guard';
import {
  AdminOrdersQueryDto,
  UpdateOrderStatusDto,
} from './dto/admin-orders.dto';
import type { Request } from 'express';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly salesService: SalesService) {}

  @UseGuards(AuthGuard)
  @Get('my-orders')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lịch sử đơn hàng của user đang đăng nhập',
    description:
      'Lọc theo tab UI: PENDING_CONFIRMATION | SHIPPING | COMPLETED | CANCELLED. Bỏ query để lấy tất cả.',
  })
  async myOrders(
    @Req()
    req: Request & { user: { id?: string; sub?: string; email?: string } },
    @Query('status') status?: string,
  ) {
    const u = req.user as { id?: string; sub?: string };
    const userId = String(u?.id ?? u?.sub ?? '');
    return this.salesService.findMyOrders(userId, status);
  }

  @UseGuards(AuthGuard)
  @Get('detail/:code')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy chi tiết đơn hàng (dành cho người mua)' })
  async getDetail(
    @Req()
    req: Request & { user: { id?: string; sub?: string } },
    @Param('code') code: string,
  ) {
    const u = req.user;
    const userId = String(u?.id ?? u?.sub ?? '');
    return this.salesService.findOrderByCodeForUser(userId, code);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/user-cancel')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Người mua tự hủy đơn hàng' })
  async userCancel(
    @Req()
    req: Request & { user: { id?: string; sub?: string } },
    @Param('id') id: string,
  ) {
    const u = req.user;
    const userId = String(u?.id ?? u?.sub ?? '');
    return this.salesService.cancelOrderByUser(userId, id);
  }

  @UseGuards(AuthGuard, AdminDashboardGuard)
  @Get('admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Quản trị: danh sách đơn + thẻ KPI',
    description:
      'Query: tab=all|pending|processing|completed, channel=all|ONLINE|O2O, q=…, date=all|today|week|month',
  })
  async adminOrders(@Query() query: AdminOrdersQueryDto) {
    return this.salesService.getAdminOrdersPage(query);
  }

  @UseGuards(AuthGuard, AdminDashboardGuard)
  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Quản trị: cập nhật trạng thái đơn' })
  async adminUpdateStatus(
    @Param('id') id: string,
    @Body() body: UpdateOrderStatusDto,
  ) {
    return this.salesService.updateOrderStatus(id, body.status);
  }

  @UseGuards(AuthGuard, AdminDashboardGuard)
  @Patch(':id/confirm')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Quản trị: xác nhận đơn hàng' })
  async adminConfirm(
    @Param('id') id: string,
    @Req() req: Request & { user: { id?: string; sub?: string } },
  ) {
    const u = req.user;
    const staffId = String(u?.id ?? u?.sub ?? '');
    return this.salesService.confirmOrder(id, staffId);
  }
}
