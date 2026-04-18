import { UsersRepository } from './users.repository';
import { JwtService } from '@nestjs/jwt';
export declare class UsersService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: UsersRepository, jwtService: JwtService);
    register(userData: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    login(loginData: any): Promise<{
        access_token: string;
        user: {
            fullName: string;
            email: string;
            role: string;
        };
    }>;
}
