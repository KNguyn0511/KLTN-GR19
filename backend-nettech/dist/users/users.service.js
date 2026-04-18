"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("./users.repository");
const jwt_1 = require("@nestjs/jwt");
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
        return await this.userRepository.create(userData);
    }
    async login(loginData) {
        const { email, password } = loginData;
        const user = await this.userRepository.findByEmailWithPassword(email);
        if (!user || user.password !== password) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng!');
        }
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        jwt_1.JwtService])
], UsersService);
//# sourceMappingURL=users.service.js.map