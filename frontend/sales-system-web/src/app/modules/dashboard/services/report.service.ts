import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportsService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/reports`;

    downloadSalesExcel(startDate: Date, endDate: Date) {
        const start = startDate.toISOString();
        const end = endDate.toISOString();

        // responseType: 'blob' es CRÍTICO para descargar archivos binarios
        return this.http.get(`${this.apiUrl}/sales-excel?start=${start}&end=${end}`, {
            responseType: 'blob',
            observe: 'response' // Para acceder al nombre del archivo si viene en headers (opcional)
        });
    }
}
