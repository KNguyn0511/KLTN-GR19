import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // ========================================================
  // 1. PHẦN CODE CỦA PARTNER (XỬ LÝ AUTH)
  // ========================================================
  async findByEmail(email: string) {
    // Bổ sung thêm điều kiện isDeleted: false để bỏ qua những user đã bị xóa mềm
    return await this.userModel.findOne({ email, isDeleted: false }).lean();
  }

  async findByEmailWithPassword(email: string) {
    // Thêm select('+password') vì ở Schema mình để select: false
    return await this.userModel
      .findOne({ email, isDeleted: false })
      .select('+password')
      .lean();
  }

  async create(userData: any) {
    const newUser = new this.userModel(userData);
    return await newUser.save();
  }

  // ========================================================
  // 2. PHẦN CODE CRUD BỔ SUNG CHO CONTROLLER/SERVICE
  // ========================================================
  async findAll() {
    // Lấy danh sách tài khoản (chỉ lấy người chưa bị xóa)
    return await this.userModel.find({ isDeleted: false }).exec();
  }

  async findById(id: string) {
    return await this.userModel.findOne({ _id: id, isDeleted: false }).exec();
  }

  async update(id: string, updateData: any) {
    return await this.userModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        updateData,
        { new: true }, // Trả về data mới nhất sau khi cập nhật
      )
      .exec();
  }

  async delete(id: string) {
    // Xóa mềm: Không xóa hẳn mà cập nhật trạng thái isDeleted thành true
    return await this.userModel
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      .exec();
  }
}
