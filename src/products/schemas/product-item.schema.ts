import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ProductItem extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  serialNumber: string;

  @Prop({ type: Types.ObjectId, required: false })
  locationId: Types.ObjectId;

  @Prop({ default: 'In Stock' })
  status: string;

  @Prop({ type: Number, default: 0 })
  importPrice: number;

  @Prop({ type: Date, default: Date.now })
  importDate: Date;
}

export const ProductItemSchema = SchemaFactory.createForClass(ProductItem);
