import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WarrantyDocument = Warranty & Document;

@Schema({ timestamps: true })
export class Warranty {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  serialNumber: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ default: 'PENDING' })
  status: string; // PENDING, APPROVED, UNDER_REPAIR, COMPLETED, RETURNED, REJECTED

  @Prop({
    type: [{
      status: String,
      note: String,
      updatedAt: { type: Date, default: Date.now }
    }],
    default: []
  })
  progress: Array<{
    status: string;
    note: string;
    updatedAt: Date;
  }>;
}

export const WarrantySchema = SchemaFactory.createForClass(Warranty);
