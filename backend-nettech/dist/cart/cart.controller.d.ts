import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    addItem(dto: AddToCartDto): Promise<import("./schemas/cart.schema").Cart>;
    getCart(userId: string): Promise<import("./schemas/cart.schema").Cart>;
    updateQuantity(dto: UpdateQuantityDto): Promise<import("./schemas/cart.schema").Cart>;
    removeItem(userId: string, cartItemId: string): Promise<import("./schemas/cart.schema").Cart>;
    clearCart(userId: string): Promise<{
        message: string;
    }>;
}
