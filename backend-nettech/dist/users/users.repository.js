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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
let UsersRepository = class UsersRepository {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findByEmail(email) {
        return await this.userModel.findOne({ email, isDeleted: false }).lean();
    }
    async findByEmailWithPassword(email) {
        return await this.userModel
            .findOne({ email, isDeleted: false })
            .select('+password')
            .lean();
    }
    async create(userData) {
        const newUser = new this.userModel(userData);
        return await newUser.save();
    }
    async findAll() {
        return await this.userModel.find({ isDeleted: false }).exec();
    }
    async findById(id) {
        return await this.userModel.findOne({ _id: id, isDeleted: false }).exec();
    }
    async update(id, updateData) {
        return await this.userModel
            .findOneAndUpdate({ _id: id, isDeleted: false }, updateData, { new: true })
            .exec();
    }
    async delete(id) {
        return await this.userModel
            .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
            .exec();
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersRepository);
//# sourceMappingURL=users.repository.js.map