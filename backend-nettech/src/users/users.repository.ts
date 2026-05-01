import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // 1. Dùng để check trùng lúc đăng ký
  async findByEmail(email: string) {
    return await this.userModel
      .findOne({
        email,
        isDeleted: { $ne: true }, // Sửa từ 'false' thành 'khác true' cho chắc
      })
      .lean();
  }

  // 2. HÀM QUAN TRỌNG NHẤT: Sửa lại logic query ở đây
  async findByEmailOrPhoneWithPassword(identifier: string) {
    return await this.userModel
      .findOne({
        $or: [{ email: identifier }, { phone: identifier }],
        isDeleted: { $ne: true }, // Dùng $ne true để lách luật nếu DB chưa có trường này
      })
      .select('+password') // Ép lấy mật khẩu ra để so sánh
      .lean();
  }

  async create(userData: any) {
    // Đảm bảo khi tạo mới luôn có isDeleted = false để sau này query đồng bộ
    const newUser = new this.userModel({ ...userData, isDeleted: false });
    return await newUser.save();
  }

  // ========================================================
  // PHẦN CRUD USERS (Giữ nguyên để Controller không báo lỗi đỏ)
  // ========================================================
  async findAll() {
    return await this.userModel.find({ isDeleted: { $ne: true } }).exec();
  }

  async findById(id: string) {
    return await this.userModel
      .findOne({ _id: id, isDeleted: { $ne: true } })
      .exec();
  }

  async update(id: string, updateData: any) {
    return await this.userModel
      .findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, updateData, {
        new: true,
      })
      .exec();
  }

  async delete(id: string) {
    return await this.userModel
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      .exec();
  }

  async findCustomersWithPagination(filter: any, skip: number, limit: number) {
    // Ép điều kiện bắt buộc: Phải là CUSTOMER và chưa bị xóa
    const finalFilter = {
      ...filter,
      role: 'CUSTOMER',
      isDeleted: { $ne: true },
    };

    return await this.userModel
      .find(finalFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  // Hàm 2: Đếm số lượng dùng cho phân trang và thống kê
  async countCustomers(filter: any = {}) {
    const finalFilter = {
      ...filter,
      role: 'CUSTOMER',
      isDeleted: { $ne: true },
    };
    return await this.userModel.countDocuments(finalFilter).exec();
  }

  async findStaffList(filter: any) {
    // 1. Gom các filter tìm kiếm và điều kiện chưa bị xóa
    const finalFilter: any = {
      ...filter,
      isDeleted: { $ne: true },
    };

    // 2. Sửa lỗi đè biến ở đây:
    // NẾU KHÔNG CÓ filter.role (tức là user chọn "Tất cả"), thì mới gắn điều kiện ẩn Customer.
    // Nếu có rồi (user chọn Store Manager) thì giữ nguyên để Mongoose tìm chính xác.
    if (!filter.role) {
      finalFilter.role = { $nin: ['Customer', 'CUSTOMER'] };
    }

    return await this.userModel
      .find(finalFilter)
      .populate('branchId', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }
}
