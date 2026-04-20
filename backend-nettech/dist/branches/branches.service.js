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
exports.BranchesService = void 0;
const common_1 = require("@nestjs/common");
const branches_repository_1 = require("./branches.repository");
const branch_schema_1 = require("./schemas/branch.schema");
let BranchesService = class BranchesService {
    branchesRepository;
    constructor(branchesRepository) {
        this.branchesRepository = branchesRepository;
    }
    async findAll(onlyActive = false) {
        const filter = onlyActive ? { status: branch_schema_1.BranchStatus.ACTIVE } : {};
        return await this.branchesRepository.findAll(filter);
    }
    async findOne(id) {
        const branch = await this.branchesRepository.findById(id);
        if (!branch)
            throw new common_1.NotFoundException('Không tìm thấy chi nhánh!');
        return branch;
    }
    async create(data) {
        return await this.branchesRepository.create(data);
    }
    async update(id, data) {
        const updated = await this.branchesRepository.update(id, data);
        if (!updated)
            throw new common_1.NotFoundException('Không tìm thấy chi nhánh để cập nhật!');
        return updated;
    }
    async remove(id) {
        const deleted = await this.branchesRepository.delete(id);
        if (!deleted)
            throw new common_1.NotFoundException('Không tìm thấy chi nhánh để xóa!');
        return { message: 'Xóa chi nhánh thành công!' };
    }
};
exports.BranchesService = BranchesService;
exports.BranchesService = BranchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [branches_repository_1.BranchesRepository])
], BranchesService);
//# sourceMappingURL=branches.service.js.map