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
    console.log('--- [DB] CREATING NOTIFICATION FOR:', data.userId);
    const notification = new this.notificationModel({
      ...data,
      userId: new Types.ObjectId(data.userId.toString()),
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
