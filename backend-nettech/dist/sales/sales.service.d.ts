import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
export declare class SalesService {
    private readonly orderModel;
    constructor(orderModel: Model<Order>);
    checkout(checkoutData: any): Promise<import("mongoose").Document<unknown, {}, Order, {}, import("mongoose").DefaultSchemaOptions> & Order & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
