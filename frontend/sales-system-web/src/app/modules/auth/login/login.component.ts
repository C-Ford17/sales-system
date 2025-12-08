import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})
export class LoginComponent {
    loading = false;
    error: string | null = null;
    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    submit(): void {
        if (this.form.invalid) return;
        this.loading = true;
        this.error = null;

        this.authService.login(this.form.value as any).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigate(['/admin/dashboard']);
            },
            error: (err) => {
                this.loading = false;
                this.error = err.error?.message ?? 'Error al iniciar sesión';
            }
        });
    }
}
