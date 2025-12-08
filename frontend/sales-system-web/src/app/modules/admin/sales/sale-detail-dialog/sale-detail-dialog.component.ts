import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { SalesService, Sale } from '../services/sales.service';

@Component({
  selector: 'app-sale-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDividerModule
  ],
  templateUrl: './sale-detail-dialog.component.html',
  styleUrls: ['./sale-detail-dialog.component.css']
})
export class SaleDetailDialogComponent implements OnInit {
  private salesService = inject(SalesService);
  sale: Sale | null = null;
  loading = true;

  displayedColumns = ['product', 'quantity', 'price', 'subtotal'];

  constructor(
    public dialogRef: MatDialogRef<SaleDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public saleId: string
  ) { }

  ngOnInit() {
    this.salesService.getSaleById(this.saleId).subscribe({
      next: (data) => {
        this.sale = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando detalle', err);
        this.loading = false;
      }
    });
  }

  printTicket() {
    window.print(); // Solución simple por ahora
  }

  close() {
    this.dialogRef.close();
  }
}
