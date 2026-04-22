// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User } from './schemas/user.schema';

// @Injectable()
// export class UsersRepository {
//   constructor(
//     @InjectModel(User.name) private readonly userModel: Model<User>,
//   ) {}

//   // ========================================================
//   // 1. PHẦN CODE CỦA PARTNER (XỬ LÝ AUTH)
//   // ========================================================
//   async findByEmail(email: string) {
//     // Bổ sung thêm điều kiện isDeleted: false để bỏ qua những user đã bị xóa mềm
//     return await this.userModel.findOne({ email, isDeleted: true }).lean();
//   }

//   // async findByEmailWithPassword(email: string) {
//   //   // Thêm select('+password') vì ở Schema mình để select: false
//   //   return await this.userModel
//   //     .findOne({ email, isDeleted: false })
//   //     .select('+password')
//   //     .lean();
//   // }

//   async findByEmailOrPhoneWithPassword(identifier: string) {
//     return await this.userModel
//       .findOne({
//         $or: [{ email: identifier }, { phone: identifier }],
//         isDeleted: false,
//       })
//       .select('+password')
//       .lean();
//   }

//   async create(userData: any) {
//     const newUser = new this.userModel(userData);
//     return await newUser.save();
//   }

//   // ========================================================
//   // 2. PHẦN CODE CRUD BỔ SUNG CHO CONTROLLER/SERVICE
//   // ========================================================
//   async findAll() {
//     // Lấy danh sách tài khoản (chỉ lấy người chưa bị xóa)
//     return await this.userModel.find({ isDeleted: false }).exec();
//   }

//   async findById(id: string) {
//     return await this.userModel.findOne({ _id: id, isDeleted: false }).exec();
//   }

//   async update(id: string, updateData: any) {
//     return await this.userModel
//       .findOneAndUpdate(
//         { _id: id, isDeleted: false },
//         updateData,
//         { new: true }, // Trả về data mới nhất sau khi cập nhật
//       )
//       .exec();
//   }

//   async delete(id: string) {
//     // Xóa mềm: Không xóa hẳn mà cập nhật trạng thái isDeleted thành true
//     return await this.userModel
//       .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
//       .exec();
//   }
// }


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
    return await this.userModel.findOne({ 
      email, 
      isDeleted: { $ne: true } // Sửa từ 'false' thành 'khác true' cho chắc
    }).lean();
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
    return await this.userModel.findOne({ _id: id, isDeleted: { $ne: true } }).exec();
  }

  async update(id: string, updateData: any) {
    return await this.userModel
      .findOneAndUpdate(
        { _id: id, isDeleted: { $ne: true } },
        updateData,
        { new: true },
      )
      .exec();
  }

  async delete(id: string) {
    return await this.userModel
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      .exec();
  }
}