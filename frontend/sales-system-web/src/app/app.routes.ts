import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth-guard'; // Asegúrate de que exista
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './modules/admin/dashboard/dashboard.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { ProductListComponent } from './modules/admin/products/product-list/product-list.component';
import { PosComponent } from './modules/admin/sales/pos/pos.component';
import { SalesListComponent } from './modules/admin/sales/sales-list/sales-list.component';

export const routes: Routes = [
    // Ruta por defecto redirige al login
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

    // Rutas de Auth (Login)
    {
        path: 'auth',
        children: [
            { path: 'login', component: LoginComponent }
        ]
    },

    // Rutas protegidas (Admin)
    {
        path: 'admin',
        component: MainLayoutComponent,
        canActivate: [AuthGuard], // Protección
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'products', component: ProductListComponent },
            { path: 'sales/pos', component: PosComponent },
            { path: 'sales/history', component: SalesListComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    // Wildcard
    { path: '**', redirectTo: 'auth/login' }
];
