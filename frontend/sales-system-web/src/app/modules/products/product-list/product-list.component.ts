import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product } from '../interfaces/product.interface';
import { ProductFormDialogComponent } from '../product-form-dialog/product-form-dialog.component';
// Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule
    ],
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
    products: Product[] = [];
    displayedColumns: string[] = ['image', 'name', 'sku', 'category', 'price', 'stock', 'status', 'actions'];

    // Filtros
    searchTerm: string = '';
    selectedStatus: string = 'Todos';

    constructor(
        private productService: ProductService,
        private dialog: MatDialog // Inyectar Dialog
    ) { }

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.productService.getProducts(this.searchTerm, this.selectedStatus)
            .subscribe({
                next: (data) => this.products = data,
                error: (err) => console.error('Error cargando productos', err)
            });
    }

    onSearch(): void {
        this.loadProducts();
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'active': return 'badge-success';
            case 'inactive': return 'badge-warning';
            case 'discontinued': return 'badge-danger';
            default: return '';
        }
    }

    openProductDialog(product?: Product): void {
        const dialogRef = this.dialog.open(ProductFormDialogComponent, {
            width: '600px',
            data: product || null,
            disableClose: true // Evita cerrar clickeando fuera
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadProducts(); // Recargar tabla si hubo cambios
            }
        });
    }

    deleteProduct(id: string): void {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
        }
    }
}
