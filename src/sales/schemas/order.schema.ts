import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/** Kênh đặt hàng — gắn badge "Mua tại quầy" khi O2O */
export const ORDER_CHANNELS = ['ONLINE', 'O2O'] as const;
export type OrderChannel = (typeof ORDER_CHANNELS)[number];

/**
 * Trạng thái đơn — khớp tab UI: Chờ xác nhận / Đang giao / Hoàn thành / Đã hủy
 * (legacy: PENDING → coi như chờ xác nhận)
 */
export const ORDER_STATUSES = [
  'PENDING_CONFIRMATION',
  'CONFIRMED',
  'PAID',
  'PACKING',
  'SHIPPING',
  'COMPLETED',
  'CANCELLED',
  /** @deprecated dùng dữ liệu cũ */
  'PENDING',
] as const;
export type OrderStatusCode = (typeof ORDER_STATUSES)[number];

@Schema({ timestamps: true })
export class Order extends Document {
  /** Mã hiển thị: #NT-2026-8892 — optional cho đơn cũ trước migration */
  @Prop({ unique: true, sparse: true })
  orderCode?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: String, enum: ORDER_CHANNELS, default: 'ONLINE' })
  channel: OrderChannel;

  @Prop({
    type: String,
    enum: ORDER_STATUSES,
    default: 'PENDING_CONFIRMATION',
  })
  status: OrderStatusCode;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        /** Đơn giá tại thời điểm mua */
        price: { type: Number },
        /** Snapshot để lịch sử không phụ thuộc Product hiện tại */
        productName: { type: String },
        variant: { type: String },
        imageUrl: { type: String },
        /** Danh sách số Serial cho từng cái trong quantity */
        serialNumbers: { type: [String], default: [] },
      },
    ],
    default: [],
  })
  items: Array<{
    product?: Types.ObjectId;
    quantity: number;
    price: number;
    productName?: string;
    variant?: string;
    imageUrl?: string;
    serialNumbers?: string[];
  }>;

  @Prop({ required: true })
  totalAmount: number;

  @Prop()
  voucherCode?: string;

  @Prop({ default: 0 })
  discountAmount: number;

  @Prop({ default: 0 })
  shippingFee: number;

  @Prop({
    type: {
      fullName: { type: String },
      phone: { type: String },
      email: { type: String },
      city: { type: String },
      district: { type: String },
      ward: { type: String },
      addressDetail: { type: String },
      paymentMethod: { type: String },
    },
    default: null,
  })
  customerInfo?: {
    fullName?: string;
    phone?: string;
    email?: string;
    city?: string;
    district?: string;
    ward?: string;
    addressDetail?: string;
    paymentMethod?: string;
  };

  @Prop({ type: Types.ObjectId, ref: 'User' })
  confirmedBy?: Types.ObjectId;

  @Prop({ type: Date })
  confirmedAt?: Date;

  /** Thời điểm nhận được tiền thanh toán (QR/chuyển khoản). Trạng thái workflow không đổi. */
  @Prop({ type: Object, default: null })
  shippingInfo?: {
    carrier: string;
    trackingNumber: string;
    shippedAt: Date;
    deliveredAt?: Date;
  };

  @Prop({ type: Date })
  paidAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
