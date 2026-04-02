/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

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
}
