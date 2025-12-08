export interface SaleDto {
    id: string;
    saleNumber: string;
    userId: string;
    userName: string;
    totalAmount: number;
    paymentMethodId: string;
    paymentMethodName: string;
    status: string;
    notes: string;
    createdAt: Date;
    details: SaleDetailDto[];
}

export interface SaleDetailDto {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    discount: number;
}

export interface CreateSaleRequest {
    paymentMethodId: string;
    notes: string;
    items: SaleItemRequest[];
}

export interface SaleItemRequest {
    productId: string;
    quantity: number;
    discount: number;
}
