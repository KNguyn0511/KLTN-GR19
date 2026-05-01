import mongoose, { Document } from 'mongoose';
export declare enum CustomerTier {
    MEMBER = "Member",
    SILVER = "Silver",
    GOLD = "Gold",
    PLATINUM = "Platinum"
}
export declare enum SystemRole {
    SUPER_ADMIN = "Super Admin",
    STORE_MANAGER = "Store Manager",
    SALES_STAFF = "Sales Staff",
    WAREHOUSE_STAFF = "Warehouse Staff",
    CUSTOMER = "Customer"
}
export declare class User extends Document {
    email: string;
    password: string;
    fullName: string;
    role: string;
    branchId: string;
    phone: string;
    memberCode: string;
    tier: string;
    totalSpent: number;
    isDeleted: boolean;
}
export declare const UserSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, any, any, User>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User, mongoose.Document<unknown, {}, User, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<User & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, User, mongoose.Document<unknown, {}, User, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<User & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: mongoose.SchemaDefinitionProperty<string, User, mongoose.Document<unknown, {}, User, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<User & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    password?: mongoose.SchemaDefinitionProperty<string, User, mongoose.Document<unknown, {}, User, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<User & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    fullName?: mongoose.SchemaDefinitionProperty<string, User, mongoose.Document<unknown, {}, User, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<User & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    role?: mongoose.SchemaDefinitionProperty<string, User, mongoose.Document<unknown, {}, User, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<User & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    branchId?: mongoose.SchemaDefinitionProperty<string, User, mongoose.Document<unknown, {}, User, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<User & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: mongoose.SchemaDefinitionProperty<string, User, mongoose.Document<unknown, {}, User, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<User & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    memberCode?: mongoose.SchemaDefinitionProperty<string, User, mongoose.Document<unknown, {}, User, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<User & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tier?: mongoose.SchemaDefinitionProperty<string, User, mongoose.Document<unknown, {}, User, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<User & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalSpent?: mongoose.SchemaDefinitionProperty<number, User, mongoose.Document<unknown, {}, User, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<User & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isDeleted?: mongoose.SchemaDefinitionProperty<boolean, User, mongoose.Document<unknown, {}, User, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<User & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, User>;
