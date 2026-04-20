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
exports.BranchSchema = exports.Branch = exports.BranchStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const mongoose_2 = require("mongoose");
var BranchStatus;
(function (BranchStatus) {
    BranchStatus["ACTIVE"] = "active";
    BranchStatus["MAINTENANCE"] = "maintenance";
})(BranchStatus || (exports.BranchStatus = BranchStatus = {}));
let Branch = class Branch extends mongoose_2.Document {
    name;
    address;
    phone;
    mapUrl;
    status;
};
exports.Branch = Branch;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'NetTech Quận 1',
        description: 'Tên của chi nhánh',
    }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Branch.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
        description: 'Địa chỉ đầy đủ của chi nhánh',
    }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Branch.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '028.1234.5678',
        description: 'Số điện thoại liên hệ của chi nhánh',
    }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Branch.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://maps.google.com/?q=NetTech+Quan1',
        description: 'Link nhúng Google Maps để hiển thị bản đồ',
        required: false,
    }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Branch.prototype, "mapUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: BranchStatus.ACTIVE,
        enum: BranchStatus,
        description: `Trạng thái chi nhánh: "${BranchStatus.ACTIVE}" = đang hoạt động, "${BranchStatus.MAINTENANCE}" = đang bảo trì`,
        default: BranchStatus.ACTIVE,
    }),
    (0, mongoose_1.Prop)({
        type: String,
        enum: BranchStatus,
        default: BranchStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Branch.prototype, "status", void 0);
exports.Branch = Branch = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Branch);
exports.BranchSchema = mongoose_1.SchemaFactory.createForClass(Branch);
//# sourceMappingURL=branch.schema.js.map