import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../../products/interfaces/product.interface';

export interface CartItem {
    product: Product;
    quantity: number;
    subtotal: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    // Usamos Signals de Angular (Moderno y reactivo)
    cartItems = signal<CartItem[]>([]);

    // Computed values (se actualizan solos)
    total = computed(() => this.cartItems().reduce((acc, item) => acc + item.subtotal, 0));
    itemCount = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));

    addToCart(product: Product) {
        const currentItems = this.cartItems();
        const existingItem = currentItems.find(item => item.product.id === product.id);

        if (existingItem) {
            // Si ya existe, validamos stock
            if (existingItem.quantity + 1 > product.quantityInStock) {
                alert('No hay suficiente stock disponible');
                return;
            }

            this.updateQuantity(product.id, existingItem.quantity + 1);
        } else {
            // Si no existe, validamos stock inicial
            if (product.quantityInStock < 1) {
                alert('Producto agotado');
                return;
            }

            this.cartItems.update(items => [...items, {
                product,
                quantity: 1,
                subtotal: product.price
            }]);
        }
    }

    removeFromCart(productId: string) {
        this.cartItems.update(items => items.filter(i => i.product.id !== productId));
    }

    updateQuantity(productId: string, quantity: number) {
        this.cartItems.update(items => items.map(item => {
            if (item.product.id === productId) {
                // Validar no exceder stock
                if (quantity > item.product.quantityInStock) return item;
                if (quantity < 1) return item;

                return {
                    ...item,
                    quantity,
                    subtotal: item.product.price * quantity
                };
            }
            return item;
        }));
    }

    clearCart() {
        this.cartItems.set([]);
    }
}
