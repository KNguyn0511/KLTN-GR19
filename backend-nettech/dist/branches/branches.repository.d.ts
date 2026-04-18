import { Model } from 'mongoose';
import { Branch } from './schemas/branch.schema';
export declare class BranchesRepository {
    private readonly branchModel;
    constructor(branchModel: Model<Branch>);
    findAll(filter?: Record<string, unknown>): Promise<Branch[]>;
    findById(id: string): Promise<Branch | null>;
    create(data: Partial<Branch>): Promise<Branch>;
    update(id: string, data: Partial<Branch>): Promise<Branch | null>;
    delete(id: string): Promise<boolean>;
}
