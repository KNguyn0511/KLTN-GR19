import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('auth') // API sẽ là /auth/register và /auth/login
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
}
