export interface ProductDto {
    id: string;
    name: string;
    description: string;
    price: number;
    cost: number;
    quantityInStock: number;
    minStock: number;
    categoryId: string;
    categoryName: string;
    sku: string;
    status: string;
    imageUrl: string;
    createdAt: Date;
    isLowStock: boolean;
}

export interface CreateProductRequest {
    name: string;
    description: string;
    price: number;
    cost: number;
    quantityInStock: number;
    minStock: number;
    categoryId: string;
    sku: string;
    imageUrl: string;
}

export interface Category {
    id: string;
    name: string;
    description: string;
}
