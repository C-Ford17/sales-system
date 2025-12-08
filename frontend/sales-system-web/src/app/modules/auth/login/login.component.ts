import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-login',
    standalone: true, // ← IMPORTANTE
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    loading = false;
    errorMessage: string | null = null; // Renombrado para coincidir con HTML (o cambia HTML a 'error')
    loginForm: FormGroup; // Renombrado para coincidir con HTML (o cambia HTML a 'form')
    hidePassword = true;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    submit(): void {
        if (this.loginForm.invalid) return;
        this.loading = true;
        this.errorMessage = null;

        this.authService.login(this.loginForm.value as any).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigate(['/panel/dashboard']);
            },
            error: (err) => {
                this.loading = false;
                this.errorMessage = err.error?.message || 'Credenciales incorrectas';
            }
        });
    }
}
