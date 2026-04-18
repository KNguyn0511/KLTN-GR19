import { Model, Types } from 'mongoose';
import { StockRequest, StockRequestStatus } from './schemas/stock-request.schema';
import { StockTransfer, StockTransferStatus } from './schemas/stock-transfer.schema';
import { BranchInventory } from './schemas/branch-inventory.schema';
export declare class StockManagementRepository {
    private readonly stockRequestModel;
    private readonly stockTransferModel;
    private readonly inventoryModel;
    constructor(stockRequestModel: Model<StockRequest>, stockTransferModel: Model<StockTransfer>, inventoryModel: Model<BranchInventory>);
    createRequest(data: Record<string, unknown>): Promise<import("mongoose").Document<unknown, {}, StockRequest, {}, import("mongoose").DefaultSchemaOptions> & StockRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAllRequests(filter: {
        status?: StockRequestStatus;
        branchId?: string;
    }): Promise<(StockRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findRequestById(id: string): Promise<(StockRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    findRequestByIdRaw(id: string): Promise<(StockRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    updateRequest(id: string, data: Record<string, unknown>): Promise<(StockRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    createTransfer(data: Record<string, unknown>): Promise<import("mongoose").Document<unknown, {}, StockTransfer, {}, import("mongoose").DefaultSchemaOptions> & StockTransfer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAllTransfers(filter: {
        status?: StockTransferStatus;
    }): Promise<(StockTransfer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findTransferById(id: string): Promise<(StockTransfer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    findTransferByIdRaw(id: string): Promise<(StockTransfer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    updateTransfer(id: string, data: Record<string, unknown>): Promise<(StockTransfer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    findInventoryByBranch(branchId: string): Promise<(BranchInventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    adjustInventory(branchId: Types.ObjectId, productId: Types.ObjectId, delta: number): Promise<import("mongoose").Document<unknown, {}, BranchInventory, {}, import("mongoose").DefaultSchemaOptions> & BranchInventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
