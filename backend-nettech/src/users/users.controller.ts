import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from './guards/auth.guard'; // Import Guard vừa tạo

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() userData: any) {
    return await this.usersService.register(userData);
  }

  @Post('login')
  async login(@Body() loginData: any) {
    return await this.usersService.login(loginData);
  }

  // API này bị khóa, phải có Token mới vào được
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // req.user chính là cái 'payload' chứa id, email, role mà bạn đã sign ở hàm login
    return {
      message: 'Lấy thông tin thành công',
      user: req.user,
    };
  }
}
