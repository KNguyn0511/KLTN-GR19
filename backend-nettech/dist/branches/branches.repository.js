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
exports.BranchesRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const branch_schema_1 = require("./schemas/branch.schema");
let BranchesRepository = class BranchesRepository {
    branchModel;
    constructor(branchModel) {
        this.branchModel = branchModel;
    }
    async findAll(filter = {}) {
        return await this.branchModel.find(filter).exec();
    }
    async findById(id) {
        return await this.branchModel.findById(id).exec();
    }
    async create(data) {
        return await this.branchModel.create(data);
    }
    async update(id, data) {
        return await this.branchModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();
    }
    async delete(id) {
        const result = await this.branchModel.findByIdAndDelete(id).exec();
        return !!result;
    }
};
exports.BranchesRepository = BranchesRepository;
exports.BranchesRepository = BranchesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(branch_schema_1.Branch.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BranchesRepository);
//# sourceMappingURL=branches.repository.js.map