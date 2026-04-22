"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("./users.repository");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    userRepository;
    jwtService;
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register(userData) {
        const exists = await this.userRepository.findByEmail(userData.email);
        if (exists)
            throw new common_1.ConflictException('Email đã tồn tại!');
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltOrRounds);
        const newUserInfo = { ...userData, password: hashedPassword };
        return await this.userRepository.create(newUserInfo);
    }
    async login(loginData) {
        const identifier = loginData.email || loginData.emailOrPhone;
        const password = loginData.password;
        const user = await this.userRepository.findByEmailOrPhoneWithPassword(identifier);
        if (!user) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng!');
        }
        const isPasswordMatching = await bcrypt.compare(password, user.password);
        if (!isPasswordMatching) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng!');
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
    async create(createUserDto) {
        const exists = await this.userRepository.findByEmail(createUserDto.email);
        if (exists)
            throw new common_1.ConflictException('Email đã tồn tại trong hệ thống!');
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);
        const newUser = { ...createUserDto, password: hashedPassword };
        return await this.userRepository.create(newUser);
    }
    async findAll() {
        return await this.userRepository.findAll();
    }
    async findOne(id) {
        const user = await this.userRepository.findById(id);
        if (!user)
            throw new common_1.NotFoundException('Không tìm thấy tài khoản!');
        return user;
    }
    async update(id, updateData) {
        const updatedUser = await this.userRepository.update(id, updateData);
        if (!updatedUser)
            throw new common_1.NotFoundException('Không tìm thấy tài khoản để cập nhật!');
        return updatedUser;
    }
    async remove(id) {
        const deleted = await this.userRepository.delete(id);
        if (!deleted)
            throw new common_1.NotFoundException('Không tìm thấy tài khoản để xóa!');
        return { message: 'Đã xóa tài khoản thành công!' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        jwt_1.JwtService])
], UsersService);
//# sourceMappingURL=users.service.js.map