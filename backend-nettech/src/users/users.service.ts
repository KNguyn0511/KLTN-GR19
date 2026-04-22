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
import * as bcrypt from 'bcrypt'; // Import bcrypt

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

    // Mã hóa mật khẩu trước khi lưu
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltOrRounds);

    // Ghi đè password gốc bằng password đã hash
    const newUserInfo = { ...userData, password: hashedPassword };

    return await this.userRepository.create(newUserInfo);
  }

  // async login(loginData: any) {
  //   const { email, password } = loginData;
  //   const user = await this.userRepository.findByEmailWithPassword(email);

  //   if (!user) {
  //     throw new UnauthorizedException('Email hoặc mật khẩu không đúng!');
  //   }

  //   // Dùng bcrypt.compare để so sánh mật khẩu người dùng nhập với hash trong DB
  //   const isPasswordMatching = await bcrypt.compare(
  //     password,
  //     (user as any).password,
  //   );

  //   if (!isPasswordMatching) {
  //     throw new UnauthorizedException('Email hoặc mật khẩu không đúng!');
  //   }

  //   // Tạo JWT
  //   const payload = {
  //     id: user._id,
  //     email: user.email,
  //     role: user.role,
  //     fullName: user.fullName,
  //   };
  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //     user: {
  //       fullName: user.fullName,
  //       email: user.email,
  //       role: user.role,
  //     },
  //   };
  // }

  // // ========================================================
  // // 2. PHẦN CRUD BỔ SUNG ĐỂ HẾT LỖI ĐỎ Ở CONTROLLER
  // // ========================================================
  // async create(createUserDto: any) {
  //   // Kiểm tra trùng email giống hàm register
  //   const exists = await this.userRepository.findByEmail(createUserDto.email);
  //   if (exists) throw new ConflictException('Email đã tồn tại trong hệ thống!');
  //   return await this.userRepository.create(createUserDto);
  // }

  async login(loginData: any) {
    // Sửa chỗ này: Lấy đúng tên biến emailOrPhone từ Frontend gửi lên
    // const { emailOrPhone, password } = loginData;
    // Lấy email nếu có, không thì lấy emailOrPhone. Có cái nào dùng cái đó!
    const identifier = loginData.email || loginData.emailOrPhone;
    const password = loginData.password;

    // Sau đó dùng identifier để tìm user
    const user =
      await this.userRepository.findByEmailOrPhoneWithPassword(identifier);

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng!');
    }

    const isPasswordMatching = await bcrypt.compare(
      password,
      (user as any).password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng!');
    }

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { fullName: user.fullName, email: user.email, role: user.role },
    };
  }

  async create(createUserDto: any) {
    const exists = await this.userRepository.findByEmail(createUserDto.email);
    if (exists) throw new ConflictException('Email đã tồn tại trong hệ thống!');

    // Bổ sung Hash mật khẩu cho đồng nhất với hàm register
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );
    const newUser = { ...createUserDto, password: hashedPassword };

    return await this.userRepository.create(newUser);
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
