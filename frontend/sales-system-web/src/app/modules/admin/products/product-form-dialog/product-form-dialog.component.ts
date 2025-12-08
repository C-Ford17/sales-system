import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../services/product.service';
import { Product } from '../interfaces/product.interface';
import { Category } from '../services/product.service';

@Component({
    selector: 'app-product-form-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule
    ],
    templateUrl: './product-form-dialog.component.html',
    styleUrls: ['./product-form-dialog.component.css']
})
export class ProductFormDialogComponent implements OnInit {
    productForm: FormGroup;
    isEditMode: boolean = false;
    categories: Category[] = [];

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        public dialogRef: MatDialogRef<ProductFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Product | null
    ) {
        this.isEditMode = !!data;
        this.productForm = this.fb.group({
            name: [data?.name || '', [Validators.required]],
            description: [data?.description || '', [Validators.required]],
            sku: [data?.sku || '', [Validators.required]],
            categoryId: [data?.categoryId || '', [Validators.required]],
            price: [data?.price || 0, [Validators.required, Validators.min(0.01)]],
            cost: [data?.cost || 0, [Validators.min(0)]],
            quantityInStock: [data?.quantityInStock || 0, [Validators.required, Validators.min(0)]],
            minStock: [data?.minStock || 5, [Validators.min(1)]],
            imageUrl: [data?.imageUrl || ''],
            status: [data?.status || 'active']
        });
    }

    ngOnInit(): void {
        // CARGAR CATEGORÍAS REALES
        this.productService.getCategories().subscribe({
            next: (cats) => {
                this.categories = cats;
                // Si estamos editando, asegurarnos que el valor seleccionado sea válido
                if (this.isEditMode && this.data) {
                    // A veces el valor ya está seteado por el formBuilder, 
                    // pero al cargar la lista se refresca visualmente el select.
                }
            },
            error: (err) => console.error('Error cargando categorías', err)
        });
    }

    onSave(): void {
        if (this.productForm.invalid) return;

        const formValue = this.productForm.value;
        // Asegurar conversión de tipos
        const productData = {
            ...formValue,
            price: Number(formValue.price),
            cost: Number(formValue.cost),
            quantityInStock: Number(formValue.quantityInStock),
            minStock: Number(formValue.minStock)
        };
        if (this.isEditMode && this.data) {
            this.productService.updateProduct(this.data.id, productData).subscribe({
                next: (updatedProduct) => this.dialogRef.close(updatedProduct),
                error: (err) => console.error(err)
            });
        } else {
            this.productService.createProduct(formValue).subscribe({
                next: (newProduct) => this.dialogRef.close(newProduct),
                error: (err) => console.error(err)
            });
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
