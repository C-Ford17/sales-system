import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SaleDetail {
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface Sale {
    id: string;
    saleNumber: string;
    userName: string;
    totalAmount: number;
    paymentMethodName: string;
    status: string;
    createdAt: string;
    details?: SaleDetail[]; // Opcional, solo viene en el getById
}

@Injectable({
    providedIn: 'root'
})
export class SalesService {
    private apiUrl = 'http://localhost:5062/api/sales';

    constructor(private http: HttpClient) { }

    getSales(filters?: { number?: string; start?: Date; end?: Date }): Observable<Sale[]> {
        let params = new HttpParams();
        if (filters?.number) params = params.set('number', filters.number);
        // Formato de fechas simple
        if (filters?.start) params = params.set('start', filters.start.toISOString());
        if (filters?.end) params = params.set('end', filters.end.toISOString());

        return this.http.get<Sale[]>(this.apiUrl, { params });
    }

    getSaleById(id: string): Observable<Sale> {
        return this.http.get<Sale>(`${this.apiUrl}/${id}`);
    }
}
