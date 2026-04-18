import { BranchesService } from './branches.service';
export declare class BranchesController {
    private readonly branchesService;
    constructor(branchesService: BranchesService);
    findAll(onlyActive?: string): Promise<import("./schemas/branch.schema").Branch[]>;
    findOne(id: string): Promise<import("./schemas/branch.schema").Branch>;
}
