/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException, // Thêm cái này để báo lỗi 404
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  // ========================================================
  // 1. PHẦN AUTH CỦA PARTNER (GIỮ NGUYÊN KHÔNG CHẠM VÀO)
  // ========================================================
  async register(userData: any) {
    const exists = await this.userRepository.findByEmail(userData.email);
    if (exists) throw new ConflictException('Email đã tồn tại!');
    return await this.userRepository.create(userData);
  }

  async login(loginData: any) {
    const { email, password } = loginData;
    const user = await this.userRepository.findByEmailWithPassword(email);

    // Kiểm tra mật khẩu
    if (!user || (user as any).password !== password) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng!');
    }

    // Tạo "Thẻ ra vào" JWT
    const payload = { id: user._id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  }

  // ========================================================
  // 2. PHẦN CRUD BỔ SUNG ĐỂ HẾT LỖI ĐỎ Ở CONTROLLER
  // ========================================================
  async create(createUserDto: any) {
    // Kiểm tra trùng email giống hàm register
    const exists = await this.userRepository.findByEmail(createUserDto.email);
    if (exists) throw new ConflictException('Email đã tồn tại trong hệ thống!');
    return await this.userRepository.create(createUserDto);
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('Không tìm thấy tài khoản!');
    return user;
  }

  async update(id: string, updateData: any) {
    const updatedUser = await this.userRepository.update(id, updateData);
    if (!updatedUser)
      throw new NotFoundException('Không tìm thấy tài khoản để cập nhật!');
    return updatedUser;
  }

  async remove(id: string) {
    // Xóa mềm hay xóa cứng tùy thuộc vào hàm delete trong repository
    const deleted = await this.userRepository.delete(id);
    if (!deleted)
      throw new NotFoundException('Không tìm thấy tài khoản để xóa!');
    return { message: 'Đã xóa tài khoản thành công!' };
  }
}
