import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title>Generar Reporte de Ventas</h2>
    <mat-dialog-content class="flex flex-col gap-4 pt-4">
      <p class="text-gray-600">Selecciona el rango de fechas para el reporte Excel.</p>
      
      <mat-form-field appearance="outline">
        <mat-label>Rango de Fechas</mat-label>
        <mat-date-range-input [rangePicker]="picker">
          <input matStartDate placeholder="Inicio" [(ngModel)]="startDate">
          <input matEndDate placeholder="Fin" [(ngModel)]="endDate">
        </mat-date-range-input>
        <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-date-range-picker #picker></mat-date-range-picker>
      </mat-form-field>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" 
              [disabled]="!startDate || !endDate"
              (click)="generate()">
        Descargar
      </button>
    </mat-dialog-actions>
  `
})
export class ReportDialogComponent {
  dialogRef = inject(MatDialogRef<ReportDialogComponent>);

  startDate: Date | null = null;
  endDate: Date | null = null;

  generate() {
    if (this.startDate && this.endDate) {
      this.dialogRef.close({ start: this.startDate, end: this.endDate });
    }
  }
}
