import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).lean();
  }

  async findByEmailWithPassword(email: string) {
    // Thêm select('+password') vì ở Schema mình để select: false
    return await this.userModel.findOne({ email }).select('+password').lean();
  }

  async create(userData: any) {
    const newUser = new this.userModel(userData);
    return await newUser.save();
  }
}
