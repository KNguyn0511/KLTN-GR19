import { Types } from 'mongoose';
import { StockManagementRepository } from './stock-management.repository';
import { StockRequestStatus } from './schemas/stock-request.schema';
import { StockTransferStatus } from './schemas/stock-transfer.schema';
export declare class StockManagementService {
    private readonly repo;
    constructor(repo: StockManagementRepository);
    createRequest(data: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/stock-request.schema").StockRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/stock-request.schema").StockRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getAllRequests(status?: string, branchId?: string): Promise<(import("./schemas/stock-request.schema").StockRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getRequestById(id: string): Promise<import("./schemas/stock-request.schema").StockRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateRequestStatus(id: string, status: StockRequestStatus, note?: string, sourceBranchId?: string): Promise<import("./schemas/stock-request.schema").StockRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    createTransfer(data: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/stock-transfer.schema").StockTransfer, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/stock-transfer.schema").StockTransfer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getAllTransfers(status?: string): Promise<(import("./schemas/stock-transfer.schema").StockTransfer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getTransferById(id: string): Promise<import("./schemas/stock-transfer.schema").StockTransfer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateTransferStatus(id: string, status: StockTransferStatus): Promise<(import("./schemas/stock-transfer.schema").StockTransfer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    getInventoryByBranch(branchId: string): Promise<(import("./schemas/branch-inventory.schema").BranchInventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
