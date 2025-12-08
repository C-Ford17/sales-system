import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { DashboardService, DashboardStats } from './services/dashboard.service';
import { SalesService } from '../sales/services/sales.service'; // Reutilizamos servicio ventas para la tabla
import { AuthService } from '../../shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SaleDetailDialogComponent } from '../sales/sale-detail-dialog/sale-detail-dialog.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    BaseChartDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private salesService = inject(SalesService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  currentUser = this.authService.getCurrentUser();
  totalWeeklySales: number = 0;
  totalItemsSold: number = 0;
  incomeChange: number = 0;
  salesChange: number = 0;
  currentRange: string = 'Últimos 7 días';
  salesPeriodLabel: string = 'Ventas (7 días)';
  chartPeriodLabel: string = 'Ventas Diarias (Últimos 7 días)';


  // Stats Cards (Inicializados en 0)
  stats = [
    { title: 'Ingresos Semanales', value: '$0', change: '0%', isPositive: true },
    { title: 'Ventas (7 días)', value: '0', change: '0%', isPositive: true },
    { title: 'Productos Activos', value: '0', change: '', isPositive: true },
    { title: 'Usuarios Activos', value: '0', change: '', isPositive: true }
  ];

  // Gráfico Líneas (Ventas Diarias)
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Ventas ($)',
      fill: true,
      tension: 0.4,
      borderColor: '#00E676',
      backgroundColor: 'rgba(0, 230, 118, 0.1)',
      pointBackgroundColor: '#fff',
      pointBorderColor: '#00E676'
    }]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { display: false },
      x: { grid: { display: false } }
    }
  };

  // Gráfico Dona (Categorías)
  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#00E676', '#3f51b5', '#FF4081', '#FFC107', '#E5E7EB'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle' } }
    }
  };

  // Tabla Últimas Ventas
  recentSales: any[] = [];

  ngOnInit() {
    this.loadDashboardStats();
    this.loadRecentSales();
  }

  changeRange(rangeLabel: string, days: number) {
    this.currentRange = rangeLabel;

    // Actualizar etiquetas visuales
    this.salesPeriodLabel = `Ventas (${days} días)`;
    this.chartPeriodLabel = `Ventas Diarias (Últimos ${days} días)`;

    this.loadDashboardStats(days);
  }

  viewSaleDetail(saleId: string) {
    // Nota: sale.id en recentSales debe ser el GUID, no el número "VEN-..." para buscarlo
    // Si tu recentSales trae el GUID en una propiedad oculta, úsala.
    // Si no, asegúrate de traer el ID real desde el backend.
    this.dialog.open(SaleDetailDialogComponent, {
      width: '600px',
      data: saleId
    });
  }
  loadDashboardStats(days: number = 7) {
    this.dashboardService.getStats(days).subscribe({
      next: (data) => {
        this.totalWeeklySales = data.weeklyIncome;
        this.incomeChange = data.incomeChangePercentage;
        this.salesChange = data.salesChangePercentage;
        // 1. Actualizar Tarjetas
        this.stats[0].change = (this.incomeChange > 0 ? '+' : '') + this.incomeChange + '%';
        this.stats[0].isPositive = this.incomeChange >= 0;
        this.stats[1].change = (this.salesChange > 0 ? '+' : '') + this.salesChange + '%';
        this.stats[1].isPositive = this.salesChange >= 0;
        this.stats[0].value = `$${data.weeklyIncome.toLocaleString()}`; // Ingresos
        this.stats[1].value = data.weeklySalesCount.toString();         // Cantidad Ventas
        this.stats[2].value = data.activeProducts.toString();           // Productos
        this.stats[3].value = data.activeUsers.toString();              // Usuarios

        // 2. Actualizar Gráfico Líneas
        this.lineChartData.labels = data.daysLabels;
        this.lineChartData.datasets[0].data = data.dailySales;

        // Forzar actualización del gráfico (importante en ng2-charts)
        this.lineChartData = { ...this.lineChartData };

        // 3. Actualizar Gráfico Dona
        this.doughnutChartData.labels = data.salesByCategory.map(c => c.categoryName);
        this.doughnutChartData.datasets[0].data = data.salesByCategory.map(c => c.salesCount);
        this.totalItemsSold = data.salesByCategory.reduce((acc, curr) => acc + curr.salesCount, 0);
        this.doughnutChartData = { ...this.doughnutChartData };


      },
      error: (err) => console.error('Error dashboard stats', err)
    });
  }

  loadRecentSales() {
    // Reutilizamos el endpoint de ventas, pidiendo pocas y ordenadas
    // Si tu endpoint soporta paginación, pide page=1&pageSize=5
    // Si no, trae todas y corta en el frontend (temporalmente)
    this.salesService.getSales().subscribe({
      next: (sales) => {
        this.recentSales = sales.slice(0, 5).map(s => ({
          originalId: s.id,
          id: s.saleNumber,
          client: s.userName, // O customerName si lo agregaste al DTO de lista
          date: s.createdAt,
          status: s.status,
          amount: s.totalAmount
        }));
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed': return 'badge-success'; // Asegúrate de tener estas clases en CSS
      case 'pending': return 'badge-warning';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-gray';
    }
  }
}
