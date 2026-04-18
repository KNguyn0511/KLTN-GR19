import { Document, Types } from 'mongoose';
export declare class ProductItem extends Document {
    product: Types.ObjectId;
    serialNumber: string;
    status: string;
}
export declare const ProductItemSchema: import("mongoose").Schema<ProductItem, import("mongoose").Model<ProductItem, any, any, any, (Document<unknown, any, ProductItem, any, import("mongoose").DefaultSchemaOptions> & ProductItem & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, ProductItem, any, import("mongoose").DefaultSchemaOptions> & ProductItem & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, ProductItem>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProductItem, Document<unknown, {}, ProductItem, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<ProductItem & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ProductItem, Document<unknown, {}, ProductItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    product?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, ProductItem, Document<unknown, {}, ProductItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    serialNumber?: import("mongoose").SchemaDefinitionProperty<string, ProductItem, Document<unknown, {}, ProductItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, ProductItem, Document<unknown, {}, ProductItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<ProductItem & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, ProductItem>;
