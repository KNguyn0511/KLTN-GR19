import { Document } from 'mongoose';
export declare enum BranchStatus {
    ACTIVE = "active",
    MAINTENANCE = "maintenance"
}
export declare class Branch extends Document {
    name: string;
    address: string;
    phone: string;
    mapUrl: string;
    status: BranchStatus;
}
export declare const BranchSchema: import("mongoose").Schema<Branch, import("mongoose").Model<Branch, any, any, any, any, any, Branch>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Branch, Document<unknown, {}, Branch, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Branch & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Branch, Document<unknown, {}, Branch, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Branch & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Branch, Document<unknown, {}, Branch, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Branch & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<BranchStatus, Branch, Document<unknown, {}, Branch, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Branch & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<string, Branch, Document<unknown, {}, Branch, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Branch & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Branch, Document<unknown, {}, Branch, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Branch & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    mapUrl?: import("mongoose").SchemaDefinitionProperty<string, Branch, Document<unknown, {}, Branch, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Branch & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Branch>;
