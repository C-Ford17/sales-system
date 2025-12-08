import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth-guard'; // Asegúrate de que exista
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './modules/admin/dashboard/dashboard.component';
import { LoginComponent } from './modules/auth/login/login.component';

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
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    // Wildcard
    { path: '**', redirectTo: 'auth/login' }
];
