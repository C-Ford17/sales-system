export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    cost: number;
    quantityInStock: number;
    minStock: number;
    categoryId: string;
    categoryName: string;
    sku: string;
    status: 'active' | 'inactive' | 'discontinued';
    imageUrl?: string;
    createdAt: string;
}

export interface ProductCreate {
    name: string;
    description?: string;
    price: number;
    cost: number;
    quantityInStock: number;
    minStock: number;
    categoryId: string;
    sku: string;
    imageUrl?: string;
}
