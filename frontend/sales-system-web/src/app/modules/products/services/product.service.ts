import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'; // Asegúrate de tener esto o usa url directa
import { Product, ProductCreate } from '../interfaces/product.interface';

export interface Category {
    id: string;
    name: string;
}
@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private apiUrl = `${environment.apiUrl}/products`;
    private categoriesUrl = `${environment.apiUrl}/categories`;

    constructor(private http: HttpClient) { }

    getProducts(filter?: string, status?: string): Observable<Product[]> {
        let params = new HttpParams();
        if (filter) params = params.set('filter', filter);
        if (status && status !== 'Todos') params = params.set('status', status);

        return this.http.get<Product[]>(this.apiUrl, { params });
    }

    getProductById(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    createProduct(productData: FormData): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, productData);
    }

    updateProduct(id: string, productData: FormData): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/${id}`, productData);
    }

    deleteProduct(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.categoriesUrl);
    }
}
