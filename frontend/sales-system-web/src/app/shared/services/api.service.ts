import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PagedResult } from '../models/common';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    get<T>(endpoint: string, params?: any): Observable<ApiResponse<T>> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] != null) {
                    httpParams = httpParams.set(key, params[key]);
                }
            });
        }
        return this.http.get<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, { params: httpParams });
    }

    post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
        return this.http.post<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, data);
    }

    put<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
        return this.http.put<ApiResponse<T>>(`${this.apiUrl}${endpoint}`, data);
    }

    delete<T>(endpoint: string): Observable<ApiResponse<T>> {
        return this.http.delete<ApiResponse<T>>(`${this.apiUrl}${endpoint}`);
    }
}
