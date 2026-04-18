import { Document, Types } from 'mongoose';
export declare class BranchInventory extends Document {
    branchId: Types.ObjectId;
    productId: Types.ObjectId;
    quantity: number;
}
export declare const BranchInventorySchema: import("mongoose").Schema<BranchInventory, import("mongoose").Model<BranchInventory, any, any, any, (Document<unknown, any, BranchInventory, any, import("mongoose").DefaultSchemaOptions> & BranchInventory & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, BranchInventory, any, import("mongoose").DefaultSchemaOptions> & BranchInventory & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, BranchInventory>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BranchInventory, Document<unknown, {}, BranchInventory, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<BranchInventory & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, BranchInventory, Document<unknown, {}, BranchInventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BranchInventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    quantity?: import("mongoose").SchemaDefinitionProperty<number, BranchInventory, Document<unknown, {}, BranchInventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BranchInventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    productId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, BranchInventory, Document<unknown, {}, BranchInventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BranchInventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    branchId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, BranchInventory, Document<unknown, {}, BranchInventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BranchInventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, BranchInventory>;
