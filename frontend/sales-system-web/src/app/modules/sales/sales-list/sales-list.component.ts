import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SalesService, Sale } from '../services/sales.service';
import { SaleDetailDialogComponent } from '../sale-detail-dialog/sale-detail-dialog.component';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatDialogModule
  ],
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css']
})
export class SalesListComponent implements OnInit {
  private salesService = inject(SalesService);
  private dialog = inject(MatDialog);

  sales: Sale[] = [];
  displayedColumns = ['number', 'date', 'user', 'payment', 'total', 'actions'];

  // Filtros
  filterNumber = '';
  startDate: Date | null = null;
  endDate: Date | null = null;

  ngOnInit() {
    this.loadSales();
  }

  loadSales() {
    this.salesService.getSales({
      number: this.filterNumber,
      start: this.startDate || undefined,
      end: this.endDate || undefined
    }).subscribe({
      next: (data) => {
        this.sales = data;
      },
      error: (err) => console.error('Error cargando ventas', err)
    });
  }

  viewDetails(sale: Sale) {
    this.dialog.open(SaleDetailDialogComponent, {
      width: '600px', // Ancho fijo o auto
      maxWidth: '90vw',
      data: sale.id
    });
  }
  clearFilters() {
    this.filterNumber = '';
    this.startDate = null;
    this.endDate = null;
    this.loadSales(); // Recargar datos limpios
  }

}
