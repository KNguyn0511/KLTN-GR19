import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
// Nhớ kiểm tra xem bạn đã tạo file create-user.dto.ts trong thư mục dto chưa nhé
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Quản lý User & Auth') // Gom nhóm trên Swagger cho đẹp
@Controller() // Để trống ở đây để có thể chia nhánh /auth và /users ở bên dưới
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('auth/register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  async register(@Body() userData: any) {
    return await this.usersService.register(userData);
  }

  @Post('auth/login')
  @ApiOperation({ summary: 'Đăng nhập hệ thống' })
  async login(@Body() loginData: any) {
    return await this.usersService.login(loginData);
  }
  @Post('users')
  @ApiOperation({ summary: 'Thêm User mới vào hệ thống' })
  create(@Body() createUserDto: CreateUserDto) {
    // Lưu ý: Nếu trong users.service.ts chưa có hàm create() thì tạm thời comment dòng dưới lại nhé
    return this.usersService.create(createUserDto);
  }

  @Get('users')
  @ApiOperation({ summary: 'Lấy danh sách tất cả User' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Xem chi tiết 1 User' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Cập nhật thông tin User' })
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Xóa User (Xóa mềm)' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
