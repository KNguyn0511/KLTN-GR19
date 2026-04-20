import { BranchesRepository } from './branches.repository';
import { Branch } from './schemas/branch.schema';
export declare class BranchesService {
    private readonly branchesRepository;
    constructor(branchesRepository: BranchesRepository);
    findAll(onlyActive?: boolean): Promise<Branch[]>;
    findOne(id: string): Promise<Branch>;
    create(data: Partial<Branch>): Promise<Branch>;
    update(id: string, data: Partial<Branch>): Promise<Branch>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
