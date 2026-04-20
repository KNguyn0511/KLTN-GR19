import { Document, Types } from 'mongoose';
export declare enum StockTransferStatus {
    SHIPPING = "SHIPPING",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}
export declare class StockTransferItem {
    productId: Types.ObjectId;
    quantity: number;
}
export declare const StockTransferItemSchema: import("mongoose").Schema<StockTransferItem, import("mongoose").Model<StockTransferItem, any, any, any, any, any, StockTransferItem>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StockTransferItem, Document<unknown, {}, StockTransferItem, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<StockTransferItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    productId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, StockTransferItem, Document<unknown, {}, StockTransferItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockTransferItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    quantity?: import("mongoose").SchemaDefinitionProperty<number, StockTransferItem, Document<unknown, {}, StockTransferItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockTransferItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, StockTransferItem>;
export declare class StockTransfer extends Document {
    fromBranch: Types.ObjectId | null;
    sourceRequestId: Types.ObjectId | null;
    toBranch: Types.ObjectId;
    items: StockTransferItem[];
    status: StockTransferStatus;
    transferDate: Date;
}
export declare const StockTransferSchema: import("mongoose").Schema<StockTransfer, import("mongoose").Model<StockTransfer, any, any, any, any, any, StockTransfer>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StockTransfer, Document<unknown, {}, StockTransfer, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<StockTransfer & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, StockTransfer, Document<unknown, {}, StockTransfer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockTransfer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    items?: import("mongoose").SchemaDefinitionProperty<StockTransferItem[], StockTransfer, Document<unknown, {}, StockTransfer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockTransfer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<StockTransferStatus, StockTransfer, Document<unknown, {}, StockTransfer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockTransfer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    fromBranch?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null, StockTransfer, Document<unknown, {}, StockTransfer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockTransfer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sourceRequestId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null, StockTransfer, Document<unknown, {}, StockTransfer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockTransfer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    toBranch?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, StockTransfer, Document<unknown, {}, StockTransfer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockTransfer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    transferDate?: import("mongoose").SchemaDefinitionProperty<Date, StockTransfer, Document<unknown, {}, StockTransfer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockTransfer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, StockTransfer>;
