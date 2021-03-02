import { Entity } from './entity';
import { Item } from './item';

export interface CartItem {
    item: Item;
    quantity: number;
}

export interface ICartProps {
    id?: string;
    products: CartItem[];
}

export class Cart extends Entity<ICartProps> {
    constructor({ id, ...data }: ICartProps) {
        super(data, id);
    }

    public static create(props: ICartProps): Cart {
        const instance = new Cart(props);

        if (instance.products) {
            const products = instance.products.map((product) => ({
                item: Item.create(product.item),
                quantity: product.quantity,
            }));

            instance.setProducts(products);
        }

        return instance;
    }

    private setProducts(products: CartItem[]) {
        this.props.products = products;
    }

    get id(): string {
        return this._id;
    }

    get products(): CartItem[] {
        return this.props.products;
    }

    get totalPrice(): number {
        const sum = (acc: number, product: CartItem) => {
            return acc + product.item.price * product.quantity;
        };
        return this.products.reduce(sum, 0);
    }

    public add(item: Item, quantity: number): void {
        const products = [...this.products, { item, quantity }];
        this.setProducts(products);
    }

    public remove(itemId: string): void {
        const products = this.products.filter(
            (product) => product.item.id !== itemId,
        );
        this.setProducts(products);
    }

    public empty(): void {
        this.setProducts([]);
    }
}