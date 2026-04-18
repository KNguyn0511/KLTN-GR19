import { Model } from 'mongoose';
import { Cart, CartItem } from './schemas/cart.schema';
export declare class CartRepository {
    private readonly cartModel;
    constructor(cartModel: Model<Cart>);
    findOrCreateByUserId(userId: string): Promise<Cart>;
    findByUserId(userId: string): Promise<Cart | null>;
    pushItem(userId: string, item: CartItem): Promise<Cart | null>;
    incrementQuantity(userId: string, cartItemId: string, amount: number): Promise<Cart | null>;
    setQuantity(userId: string, cartItemId: string, quantity: number): Promise<Cart | null>;
    removeItem(userId: string, cartItemId: string): Promise<Cart | null>;
    clearCart(userId: string): Promise<Cart | null>;
}
