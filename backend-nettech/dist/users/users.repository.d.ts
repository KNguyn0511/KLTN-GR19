import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
export declare class UsersRepository {
    private readonly userModel;
    constructor(userModel: Model<User>);
    findByEmail(email: string): Promise<(User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    findByEmailWithPassword(email: string): Promise<(User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    create(userData: any): Promise<import("mongoose").Document<unknown, {}, User, {}, import("mongoose").DefaultSchemaOptions> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
