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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const products_repository_1 = require("./products.repository");
const categories_service_1 = require("../categories/categories.service");
let ProductsService = class ProductsService {
    productRepository;
    categoriesService;
    constructor(productRepository, categoriesService) {
        this.productRepository = productRepository;
        this.categoriesService = categoriesService;
    }
    async findAll(query = {}) {
        const { page = 1, limit = 10, sort, cpu, vga, minPrice, maxPrice, brand, search, category, } = query;
        const filter = {};
        if (cpu)
            filter['specifications.cpu'] = new RegExp(String(cpu), 'i');
        if (vga)
            filter['specifications.vga'] = new RegExp(String(vga), 'i');
        if (brand)
            filter.brand = new RegExp(String(brand), 'i');
        if (search)
            filter.name = new RegExp(String(search), 'i');
        if (category) {
            if (mongoose_1.Types.ObjectId.isValid(String(category))) {
                filter.category = new mongoose_1.Types.ObjectId(String(category));
            }
            else {
                try {
                    const cat = await this.categoriesService.findBySlug(String(category));
                    filter.category = cat._id;
                }
                catch {
                    return {
                        products: [],
                        pagination: { total: 0, page: Number(page), pages: 0 },
                    };
                }
            }
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice)
                filter.price.$gte = Number(minPrice);
            if (maxPrice)
                filter.price.$lte = Number(maxPrice);
        }
        const skip = (Number(page) - 1) * Number(limit);
        const products = await this.productRepository.findAll(filter, sort, skip, Number(limit));
        const total = await this.productRepository.count(filter);
        return {
            products,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
            },
        };
    }
    async findOne(id) {
        const product = await this.productRepository.findById(id);
        if (!product)
            throw new common_1.NotFoundException('Không tìm thấy sản phẩm!');
        const items = await this.productRepository.findItemsByProductId(id);
        const productData = product.toObject
            ? product.toObject()
            : product;
        return {
            ...productData,
            availableItems: items.filter((item) => item.status === 'AVAILABLE'),
            totalInStock: product.totalStock || 0,
        };
    }
    async create(productData) {
        if (!productData.sku) {
            productData.sku = `SKU-${Date.now()}`;
        }
        return await this.productRepository.create(productData);
    }
    async update(id, updateData) {
        const updatedProduct = await this.productRepository.update(id, updateData);
        if (!updatedProduct) {
            throw new common_1.NotFoundException('Không tìm thấy sản phẩm để cập nhật!');
        }
        return updatedProduct;
    }
    async updateStock(id, quantityChange) {
        const product = await this.productRepository.findById(id);
        if (!product)
            throw new common_1.NotFoundException('Sản phẩm không tồn tại!');
        const currentStock = product.totalStock || 0;
        const newStock = currentStock + quantityChange;
        if (newStock < 0) {
            throw new common_1.BadRequestException(`Kho không đủ! Hiện tại chỉ còn ${currentStock} sản phẩm.`);
        }
        return await this.productRepository.update(id, { totalStock: newStock });
    }
    async remove(id) {
        const result = await this.productRepository.delete(id);
        if (!result)
            throw new common_1.NotFoundException('Không tìm thấy sản phẩm để xóa!');
        return { message: 'Xóa sản phẩm thành công!' };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_repository_1.ProductsRepository,
        categories_service_1.CategoriesService])
], ProductsService);
//# sourceMappingURL=products.service.js.map