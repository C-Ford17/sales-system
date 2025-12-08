import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http'; // Importante
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { routes } from './app.routes';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor'; // Ajusta la ruta si es necesario
import { provideNativeDateAdapter } from '@angular/material/core';
// Función wrapper para el interceptor funcional (Angular 18+ prefiere fn interceptors)
// Si tu AuthInterceptor es una clase, necesitamos un adaptador o convertirlo.
// Por simplicidad, asumo que quieres usar la clase existente.
import { AuthInterceptor as ClassInterceptor } from './shared/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideCharts(withDefaultRegisterables()),
    provideHttpClient(withInterceptorsFromDi()),
    provideNativeDateAdapter(),
    // Registrar el interceptor basado en clase (Legacy support)
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ]
};
