import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
    weeklyIncome: number;
    incomeChangePercentage: number; // <--- AGREGAR
    weeklySalesCount: number;
    salesChangePercentage: number;  // <--- AGREGAR
    activeProducts: number;
    activeUsers: number;
    dailySales: number[];
    daysLabels: string[];
    salesByCategory: { categoryName: string; salesCount: number }[];
}


@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5062/api/dashboard'; // Ajusta tu puerto

    getStats(days: number = 7): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(`${this.apiUrl}?days=${days}`);
    }
}
