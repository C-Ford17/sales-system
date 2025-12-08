import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const userRole = authService.getUserRole(); // Asegúrate de tener este método en AuthService
  const expectedRoles = route.data['roles'] as Array<string>;

  if (!userRole) {
    router.navigate(['/auth/login']);
    return false;
  }

  // Si la ruta no especifica roles, dejamos pasar (o bloqueamos, según prefieras)
  if (!expectedRoles || expectedRoles.length === 0) {
    return true;
  }

  // Verificar si el rol del usuario está en los permitidos
  // Nota: Asegúrate de normalizar (lowercase/uppercase) si es necesario
  if (expectedRoles.includes(userRole)) {
    return true;
  }

  // Acceso denegado
  snackBar.open('No tienes permisos para acceder a esta sección', 'Cerrar', {
    duration: 3000,
    panelClass: ['error-snackbar'] // Opcional: clase CSS
  });

  // Redirigir a una ruta segura (ej. Dashboard o POS)
  router.navigate(['/admin/dashboard']);
  return false;
};
