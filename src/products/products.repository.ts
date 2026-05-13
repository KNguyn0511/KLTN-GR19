import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './schemas/product.schema';
import { ProductItem } from './schemas/product-item.schema';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(ProductItem.name)
    private readonly productItemModel: Model<ProductItem>,
  ) {}

  async findAll(filter: any, sort: any, skip: number, limit: number) {
    return await this.productModel
      .find(filter)
      .populate('category', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findAllRaw() {
    return await this.productModel.find().lean().exec();
  }

  async count(filter: any) {
    return await this.productModel.countDocuments(filter).exec();
  }

  async findById(id: string) {
    return await this.productModel.findById(id).exec();
  }

  async create(data: any) {
    return await this.productModel.create(data);
  }

  async update(id: string, data: any) {
    return await this.productModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  // --- PRODUCT ITEM OPERATIONS ---

  async findItemsByProductId(productId: string): Promise<any[]> {
    return await this.productItemModel
      .find({ productId: new Types.ObjectId(productId) })
      .lean()
      .exec();
  }

  async createItem(data: any) {
    return await this.productItemModel.create(data);
  }

  async clearAllItems() {
    return await this.productItemModel.deleteMany({}).exec();
  }

  async insertManyItems(items: any[]) {
    return await this.productItemModel.insertMany(items);
  }
}
