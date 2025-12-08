import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { BaseChartDirective } from 'ng2-charts'; // Importar directiva de gráficos
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    BaseChartDirective // Agregar aquí
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  // Stats Cards
  stats = [
    { title: 'Ingresos Semanales', value: '$12,450', change: '+5.2%', isPositive: true },
    { title: 'Ventas (Últimos 7 días)', value: '312', change: '-1.8%', isPositive: false },
    { title: 'Productos Activos', value: '85', change: '+3', isPositive: true },
    { title: 'Usuarios Activos', value: '42', change: '+10%', isPositive: true }
  ];

  // Configuración Gráfico de Líneas (Ventas Diarias)
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 120, 90],
        label: 'Ventas',
        fill: true,
        tension: 0.4, // Curva suave
        borderColor: '#00E676',
        backgroundColor: 'rgba(0, 230, 118, 0.1)',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#00E676',
        pointHoverBackgroundColor: '#00E676',
        pointHoverBorderColor: '#fff'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }, // Ocultar leyenda
    scales: {
      y: { display: false }, // Ocultar eje Y para que se vea limpio como el diseño
      x: { grid: { display: false } }
    }
  };

  // Configuración Gráfico de Dona (Categorías)
  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Electrónica', 'Ropa', 'Otros'],
    datasets: [
      {
        data: [180, 80, 40],
        backgroundColor: ['#00E676', '#3f51b5', '#E5E7EB'],
        hoverBackgroundColor: ['#00C853', '#303f9f', '#D1D5DB'],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };
  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false, // <--- ESTO ES CRÍTICO
    cutout: '75%', // Hace el agujero más grande (estilo anillo delgado)
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle', padding: 20 } }
    }
  };

  recentSales = [
    { id: '#12548', client: 'Juan Pérez', date: '2023-10-27', status: 'Completado', amount: '$250.00' },
    { id: '#12547', client: 'Ana Gómez', date: '2023-10-26', status: 'Pendiente', amount: '$120.50' },
    { id: '#12546', client: 'Carlos Ruiz', date: '2023-10-26', status: 'Completado', amount: '$75.20' },
    { id: '#12545', client: 'Lucía Fernández', date: '2023-10-25', status: 'Cancelado', amount: '$50.00' },
    { id: '#12544', client: 'Miguel Torres', date: '2023-10-24', status: 'Completado', amount: '$310.75' }
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completado': return 'badge badge-success';
      case 'Pendiente': return 'badge badge-warning';
      case 'Cancelado': return 'badge badge-danger';
      default: return 'badge';
    }
  }
}
