import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WarrantyService } from './warranty.service';
import { AuthGuard } from '../users/guards/auth.guard';
import { AdminDashboardGuard } from '../dashboard/guards/admin-dashboard.guard';
import { CreateWarrantyDto, UpdateWarrantyStatusDto } from './dto/warranty.dto';
import { Request } from 'express';

@ApiTags('Warranty')
@Controller('warranty')
export class WarrantyController {
  constructor(private readonly warrantyService: WarrantyService) {}

  @UseGuards(AuthGuard)
  @Post('request')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gửi yêu cầu bảo hành' })
  async createRequest(
    @Req() req: Request & { user: { id: string } },
    @Body() dto: CreateWarrantyDto,
  ) {
    return this.warrantyService.createRequest(req.user.id, dto);
  }

  @UseGuards(AuthGuard)
  @Get('my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách yêu cầu bảo hành của tôi' })
  async getMyWarranties(@Req() req: Request & { user: { id: string } }) {
    return this.warrantyService.getMyWarranties(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('eligible-products')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm có thể bảo hành' })
  async getEligibleProducts(@Req() req: Request & { user: { id: string } }) {
    return this.warrantyService.getEligibleProducts(req.user.id);
  }

  @UseGuards(AuthGuard, AdminDashboardGuard)
  @Get('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: Lấy tất cả yêu cầu bảo hành' })
  async getAllWarranties() {
    return this.warrantyService.getAllWarranties();
  }

  @UseGuards(AuthGuard, AdminDashboardGuard)
  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: Cập nhật trạng thái bảo hành' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateWarrantyStatusDto,
  ) {
    return this.warrantyService.updateStatus(id, dto);
  }
}
