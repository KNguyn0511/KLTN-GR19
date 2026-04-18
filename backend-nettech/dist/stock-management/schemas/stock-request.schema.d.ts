import { Document, Types } from 'mongoose';
export declare enum StockRequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    COMPLETED = "COMPLETED"
}
export declare class StockRequestItem {
    productId: Types.ObjectId;
    quantity: number;
}
export declare const StockRequestItemSchema: import("mongoose").Schema<StockRequestItem, import("mongoose").Model<StockRequestItem, any, any, any, (Document<unknown, any, StockRequestItem, any, import("mongoose").DefaultSchemaOptions> & StockRequestItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, StockRequestItem, any, import("mongoose").DefaultSchemaOptions> & StockRequestItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, StockRequestItem>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StockRequestItem, Document<unknown, {}, StockRequestItem, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<StockRequestItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    productId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, StockRequestItem, Document<unknown, {}, StockRequestItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockRequestItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    quantity?: import("mongoose").SchemaDefinitionProperty<number, StockRequestItem, Document<unknown, {}, StockRequestItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockRequestItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, StockRequestItem>;
export declare class StockRequest extends Document {
    requester: Types.ObjectId;
    branchId: Types.ObjectId;
    sourceBranchId: Types.ObjectId | null;
    items: StockRequestItem[];
    status: StockRequestStatus;
    note: string;
}
export declare const StockRequestSchema: import("mongoose").Schema<StockRequest, import("mongoose").Model<StockRequest, any, any, any, (Document<unknown, any, StockRequest, any, import("mongoose").DefaultSchemaOptions> & StockRequest & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, StockRequest, any, import("mongoose").DefaultSchemaOptions> & StockRequest & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, StockRequest>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StockRequest, Document<unknown, {}, StockRequest, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<StockRequest & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, StockRequest, Document<unknown, {}, StockRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    items?: import("mongoose").SchemaDefinitionProperty<StockRequestItem[], StockRequest, Document<unknown, {}, StockRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<StockRequestStatus, StockRequest, Document<unknown, {}, StockRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    requester?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, StockRequest, Document<unknown, {}, StockRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    branchId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, StockRequest, Document<unknown, {}, StockRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sourceBranchId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null, StockRequest, Document<unknown, {}, StockRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    note?: import("mongoose").SchemaDefinitionProperty<string, StockRequest, Document<unknown, {}, StockRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<StockRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, StockRequest>;
