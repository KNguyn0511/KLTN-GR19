import { ProductsRepository } from './products.repository';
export declare class ProductsService {
    private readonly productRepository;
    constructor(productRepository: ProductsRepository);
    findAll(query?: any): Promise<any>;
    findOne(id: string): Promise<any>;
    create(productData: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/product.schema").Product, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/product.schema").Product & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, updateData: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/product.schema").Product, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/product.schema").Product & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateStock(id: string, quantityChange: number): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/product.schema").Product, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/product.schema").Product & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
