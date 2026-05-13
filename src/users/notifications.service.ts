import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
  ) {}

  async createNotification(data: {
    userId: any;
    title: string;
    message: string;
    orderId?: any;
    type?: string;
  }) {
    // Kiểm tra và ép kiểu an toàn cho userId và orderId
    let validUserId: Types.ObjectId | null = null;
    let validOrderId: Types.ObjectId | null = null;

    try {
      // Nếu userId là object (do populate), lấy _id của nó, nếu không dùng trực tiếp
      const rawUserId = data.userId?._id ? data.userId._id.toString() : data.userId?.toString();
      if (rawUserId && Types.ObjectId.isValid(rawUserId)) {
        validUserId = new Types.ObjectId(rawUserId);
      }

      const rawOrderId = data.orderId?._id ? data.orderId._id.toString() : data.orderId?.toString();
      if (rawOrderId && Types.ObjectId.isValid(rawOrderId)) {
        validOrderId = new Types.ObjectId(rawOrderId);
      }
    } catch (e) {
      console.warn('--- [DB] ID CAST ERROR:', e.message);
    }

    if (!validUserId) {
      console.warn('--- [DB] SKIPPING NOTIFICATION: No valid userId');
      return null;
    }

    const notification = new this.notificationModel({
      ...data,
      userId: validUserId,
      orderId: validOrderId,
      isRead: false,
    });
    const saved = await notification.save();



    console.log('--- [DB] NOTIFICATION SAVED! ID:', saved._id);
    return saved;
  }

  async getNotifications(userId: string) {
    return this.notificationModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(notificationId: string) {
    return this.notificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
  }

  async markAllAsRead(userId: string) {
    return this.notificationModel
      .updateMany(
        { userId: new Types.ObjectId(userId), isRead: false },
        { isRead: true }
      )
      .exec();
  }
}
