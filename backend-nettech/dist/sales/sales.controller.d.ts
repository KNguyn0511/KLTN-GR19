import { SalesService } from './sales.service';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    checkout(checkoutData: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/order.schema").Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
