import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

// Layouts
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

// Componentes
import { LoginComponent } from './modules/auth/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ProductListComponent } from './modules/products/product-list/product-list.component';
import { PosComponent } from './modules/sales/pos/pos.component';
import { SalesListComponent } from './modules/sales/sales-list/sales-list.component';
import { UserListComponent } from './modules/users/user-list/user-list.component';
import { SettingsComponent } from './modules/settings/settings.component';
export const routes: Routes = [
    // Redirección inicial
    { path: '', redirectTo: 'panel/dashboard', pathMatch: 'full' },

    // Rutas de Autenticación
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    },

    // Rutas de Administración (Protegidas)
    {
        path: 'panel',
        component: MainLayoutComponent,
        canActivate: [AuthGuard], // Primero verifica login
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
                // Todos los logueados entran al dashboard
            },

            // VENTAS (POS): Accesible para todos (Admin, Supervisor, Employee)
            {
                path: 'sales/pos',
                component: PosComponent,
                data: { roles: ['Admin', 'Supervisor', 'Employee'] },
                canActivate: [roleGuard]
            },

            // HISTORIAL: Accesible para todos
            {
                path: 'sales/history',
                component: SalesListComponent,
                data: { roles: ['Admin', 'Supervisor', 'Employee'] },
                canActivate: [roleGuard]
            },

            // PRODUCTOS: Solo Admin y Supervisor
            {
                path: 'products',
                component: ProductListComponent,
                data: { roles: ['Admin', 'Supervisor'] },
                canActivate: [roleGuard]
            },

            // USUARIOS: Solo Admin (Crítico)
            {
                path: 'users',
                component: UserListComponent,
                data: { roles: ['Admin'] },
                canActivate: [roleGuard]
            },
            { path: 'settings', component: SettingsComponent },

            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    // Wildcard (404)
    { path: '**', redirectTo: 'auth/login' }
];