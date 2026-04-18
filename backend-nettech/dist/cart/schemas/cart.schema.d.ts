import { Document } from 'mongoose';
export declare class CartItem {
    cartItemId: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    configName?: string;
    sku?: string;
}
export declare const CartItemSchema: import("mongoose").Schema<CartItem, import("mongoose").Model<CartItem, any, any, any, (Document<unknown, any, CartItem, any, import("mongoose").DefaultSchemaOptions> & CartItem & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, CartItem, any, import("mongoose").DefaultSchemaOptions> & CartItem & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, CartItem>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CartItem, Document<unknown, {}, CartItem, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<CartItem & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    cartItemId?: import("mongoose").SchemaDefinitionProperty<string, CartItem, Document<unknown, {}, CartItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CartItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    productId?: import("mongoose").SchemaDefinitionProperty<string, CartItem, Document<unknown, {}, CartItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CartItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, CartItem, Document<unknown, {}, CartItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CartItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    price?: import("mongoose").SchemaDefinitionProperty<number, CartItem, Document<unknown, {}, CartItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CartItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    image?: import("mongoose").SchemaDefinitionProperty<string, CartItem, Document<unknown, {}, CartItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CartItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    quantity?: import("mongoose").SchemaDefinitionProperty<number, CartItem, Document<unknown, {}, CartItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CartItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    configName?: import("mongoose").SchemaDefinitionProperty<string | undefined, CartItem, Document<unknown, {}, CartItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CartItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sku?: import("mongoose").SchemaDefinitionProperty<string | undefined, CartItem, Document<unknown, {}, CartItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CartItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, CartItem>;
export declare class Cart extends Document {
    userId: string;
    items: CartItem[];
}
export declare const CartSchema: import("mongoose").Schema<Cart, import("mongoose").Model<Cart, any, any, any, (Document<unknown, any, Cart, any, import("mongoose").DefaultSchemaOptions> & Cart & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Cart, any, import("mongoose").DefaultSchemaOptions> & Cart & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}), any, Cart>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Cart, Document<unknown, {}, Cart, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Cart & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Cart, Document<unknown, {}, Cart, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Cart & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    items?: import("mongoose").SchemaDefinitionProperty<CartItem[], Cart, Document<unknown, {}, Cart, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Cart & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<string, Cart, Document<unknown, {}, Cart, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Cart & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Cart>;
