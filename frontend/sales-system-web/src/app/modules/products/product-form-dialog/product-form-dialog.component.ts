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

    // --- NUEVO: Variables para manejo de imagen ---
    selectedFile: File | null = null;
    imagePreview: string | null = null;
    // ----------------------------------------------

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
            // imageUrl: No lo necesitamos en el FormGroup porque lo manejamos separado
            status: [data?.status || 'active']
        });

        // --- NUEVO: Cargar preview si ya existe imagen ---
        if (data?.imageUrl) {
            this.imagePreview = data.imageUrl;
        }
    }

    ngOnInit(): void {
        this.productService.getCategories().subscribe({
            next: (cats) => this.categories = cats,
            error: (err) => console.error('Error cargando categorías', err)
        });
    }

    // --- NUEVO: Método para detectar selección de archivo ---
    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                alert('El archivo es demasiado grande. Máximo 5MB.');
                // Limpiar input
                event.target.value = '';
                return;
            }

            // Crear preview local para mostrarla antes de subir
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    onSave(): void {
        if (this.productForm.invalid) return;

        // --- NUEVO: Convertir a FormData para enviar archivo ---
        const formData = new FormData();
        const formValue = this.productForm.value;

        // 1. Agregar campos de texto al FormData
        formData.append('name', formValue.name);
        formData.append('description', formValue.description);
        formData.append('sku', formValue.sku);
        formData.append('categoryId', formValue.categoryId);
        formData.append('price', formValue.price.toString()); // Importante convertir a string
        formData.append('cost', formValue.cost.toString());
        formData.append('quantityInStock', formValue.quantityInStock.toString());
        formData.append('minStock', formValue.minStock.toString());
        formData.append('status', formValue.status);

        // 2. Agregar archivo si existe selección nueva
        if (this.selectedFile) {
            formData.append('image', this.selectedFile);
        }
        // -----------------------------------------------------

        if (this.isEditMode && this.data) {
            // Nota: Asegúrate de que tu servicio updateProduct acepte FormData
            this.productService.updateProduct(this.data.id, formData).subscribe({
                next: (updatedProduct) => this.dialogRef.close(updatedProduct),
                error: (err) => console.error(err)
            });
        } else {
            // Nota: Asegúrate de que tu servicio createProduct acepte FormData
            this.productService.createProduct(formData).subscribe({
                next: (newProduct) => this.dialogRef.close(newProduct),
                error: (err) => console.error(err)
            });
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
