import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ProductService } from '../../products/services/product.service';
import { CartService } from '../services/cart.service';
import { Product } from '../../products/interfaces/product.interface';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'; // Para enviar la venta al backend

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatAutocompleteModule,
    MatRadioModule
  ],
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit {
  private productService = inject(ProductService);
  public cartService = inject(CartService); // Público para usar signals en HTML
  private http = inject(HttpClient);

  searchControl = new FormControl('');
  filteredProducts: Product[] = [];

  // Datos de la venta
  selectedPaymentMethod = 'Efectivo'; // Debe coincidir con BD ("Efectivo", "Tarjeta")
  customerName = '';

  displayedColumns: string[] = ['product', 'price', 'quantity', 'total', 'actions'];

  ngOnInit() {
    // Autocomplete Search
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value || typeof value !== 'string') return [];
        return this.productService.getProducts(value); // Usamos tu filtro existente
      })
    ).subscribe(products => {
      this.filteredProducts = products;
    });
  }

  addProduct(product: Product) {
    this.cartService.addToCart(product);
    this.searchControl.setValue(''); // Limpiar buscador
    this.filteredProducts = [];
  }

  // Método auxiliar para el display del autocomplete
  displayFn(product: Product): string {
    return product && product.name ? product.name : '';
  }

  processSale() {
    if (this.cartService.cartItems().length === 0) return;

    const saleData = {
      paymentMethod: this.selectedPaymentMethod,
      customerName: this.customerName || 'Cliente General',
      details: this.cartService.cartItems().map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    // Llamada directa al endpoint de ventas (podrías moverlo a un SalesService)
    this.http.post('http://localhost:5062/api/sales', saleData).subscribe({
      next: (res) => {
        alert('¡Venta registrada con éxito!');
        this.cartService.clearCart();
        this.customerName = '';
        this.searchControl.setValue('');
        this.filteredProducts = [];
      },
      error: (err) => {
        console.error(err);
        alert('Error al procesar la venta: ' + (err.error?.message || 'Error desconocido'));
      }
    });
  }
}
