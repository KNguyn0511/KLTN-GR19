import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Warranty, WarrantyDocument } from './schemas/warranty.schema';
import { CreateWarrantyDto, UpdateWarrantyStatusDto } from './dto/warranty.dto';
import { Order } from '../sales/schemas/order.schema';
import { Product } from '../products/schemas/product.schema';
import { NotificationGateway } from '../notifications/notification.gateway';

@Injectable()
export class WarrantyService {
  constructor(
    @InjectModel(Warranty.name) private warrantyModel: Model<WarrantyDocument>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    private notificationGateway: NotificationGateway,
  ) {}

  async createRequest(userId: string, dto: CreateWarrantyDto): Promise<Warranty> {
    const warranty = new this.warrantyModel({
      ...dto,
      userId: new Types.ObjectId(userId),
      orderId: new Types.ObjectId(dto.orderId),
      productId: new Types.ObjectId(dto.productId),
      progress: [{
        status: 'PENDING',
        note: 'Yêu cầu bảo hành đã được gửi.',
        updatedAt: new Date()
      }]
    });

    const saved = await warranty.save();

    // Notify Super Admin
    this.notificationGateway.notifyAdmins('NEW_WARRANTY_REQUEST', {
      warrantyId: saved._id,
      productName: saved.productName,
      userName: userId, // In real case, fetch user name
    });

    return saved;
  }

  async getMyWarranties(userId: string) {
    return this.warrantyModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
  }

  async getAllWarranties() {
    return this.warrantyModel.find().populate('userId', 'fullName email').sort({ createdAt: -1 });
  }

  async updateStatus(id: string, dto: UpdateWarrantyStatusDto) {
    const warranty = await this.warrantyModel.findById(id);
    if (!warranty) throw new NotFoundException('Không tìm thấy yêu cầu bảo hành');

    warranty.status = dto.status;
    warranty.progress.push({
      status: dto.status,
      note: dto.note || `Trạng thái được cập nhật thành ${dto.status}`,
      updatedAt: new Date(),
    });

    const updated = await warranty.save();

    // Notify User
    this.notificationGateway.notifyUser(warranty.userId.toString(), 'WARRANTY_STATUS_UPDATED', {
      warrantyId: updated._id,
      status: updated.status,
      productName: updated.productName,
    });

    return updated;
  }

  async getEligibleProducts(userId: string) {
    // 1. Lấy tất cả đơn hàng đã hoàn thành của user
    const orders = await this.orderModel.find({
      user: new Types.ObjectId(userId),
      status: 'COMPLETED'
    }).populate('items.product');

    // 2. Lấy tất cả yêu cầu bảo hành hiện có để check status
    const existingWarranties = await this.warrantyModel.find({ userId: new Types.ObjectId(userId) });

    const eligibleProducts: any[] = [];

    for (const order of orders) {
      // Xác định ngày bắt đầu bảo hành (ưu tiên deliveredAt, fallback confirmedAt hoặc updatedAt)
      const startDate = order.shippingInfo?.deliveredAt || order.confirmedAt || (order as any).updatedAt;

      for (const item of order.items) {
        const product = item.product as any;
        if (!product) continue;

        const warrantyMonths = product.warrantyMonths || 12;
        const expiryDate = new Date(startDate);
        expiryDate.setMonth(expiryDate.getMonth() + warrantyMonths);

        const isExpired = new Date() > expiryDate;
        
        // Tìm xem item này có đang trong yêu cầu bảo hành nào không
        const currentWarranty = existingWarranties.find(w => 
          w.orderId.toString() === order._id.toString() && 
          w.productId.toString() === product._id.toString()
        );

        eligibleProducts.push({
          orderId: order._id,
          orderCode: order.orderCode,
          productId: product._id,
          productName: item.productName || product.name,
          imageUrl: item.imageUrl || product.images?.[0],
          serialNumbers: item.serialNumbers,
          purchaseDate: startDate,
          expiryDate: expiryDate,
          isExpired: isExpired,
          currentWarrantyStatus: currentWarranty?.status || null,
          warrantyId: currentWarranty?._id || null,
        });
      }
    }

    return eligibleProducts;
  }
}
