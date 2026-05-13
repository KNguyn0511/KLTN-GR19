import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { NotificationsService } from './notifications.service';
import { User, UserSchema } from './schemas/user.schema';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { AuthGuard, OptionalJwtAuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    NotificationsService,
    AuthGuard,
    OptionalJwtAuthGuard,
  ],
  exports: [
    UsersService, 
    UsersRepository,
    NotificationsService,
    AuthGuard,       
    OptionalJwtAuthGuard
  ],
})
export class UsersModule {}