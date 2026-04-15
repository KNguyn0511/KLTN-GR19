/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; // Import bcrypt

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(userData: any) {
    const exists = await this.userRepository.findByEmail(userData.email);
    if (exists) throw new ConflictException('Email đã tồn tại!');

    // Mã hóa mật khẩu trước khi lưu
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltOrRounds);

    // Ghi đè password gốc bằng password đã hash
    const newUserInfo = { ...userData, password: hashedPassword };

    return await this.userRepository.create(newUserInfo);
  }

  async login(loginData: any) {
    const { email, password } = loginData;
    const user = await this.userRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng!');
    }

    // Dùng bcrypt.compare để so sánh mật khẩu người dùng nhập với hash trong DB
    const isPasswordMatching = await bcrypt.compare(
      password,
      (user as any).password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng!');
    }

    // Tạo JWT
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  }
}
