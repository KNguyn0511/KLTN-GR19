import { CartRepository } from './cart.repository';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { Cart } from './schemas/cart.schema';
export declare class CartService {
    private readonly cartRepository;
    constructor(cartRepository: CartRepository);
    getCart(userId: string): Promise<Cart>;
    addItem(dto: AddToCartDto): Promise<Cart>;
    updateQuantity(dto: UpdateQuantityDto): Promise<Cart>;
    removeItem(userId: string, cartItemId: string): Promise<Cart>;
    clearCart(userId: string): Promise<{
        message: string;
    }>;
}
