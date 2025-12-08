import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../users/services/user.service'; // Reutilizamos

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule
    ],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
    private authService = inject(AuthService);
    private userService = inject(UserService);
    private fb = inject(FormBuilder);
    private snackBar = inject(MatSnackBar);

    currentUser: any = null;
    isAdmin = false;
    hideCurrentPass = true;
    hideNewPass = true;

    profileForm: FormGroup;
    passwordForm: FormGroup;

    constructor() {
        this.profileForm = this.fb.group({
            fullName: ['', Validators.required],
            phone: ['', Validators.required],
            email: [{ value: '', disabled: true }] // Email no editable por seguridad básica
        });

        this.passwordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    ngOnInit() {
        this.currentUser = this.authService.getCurrentUser();
        this.isAdmin = this.currentUser?.roleName === 'Admin';

        if (this.currentUser) {
            this.profileForm.patchValue({
                fullName: this.currentUser.fullName,
                email: this.currentUser.email,
                phone: this.currentUser.phone || ''
            });
        }
    }

    updateProfile() {
        if (this.profileForm.invalid) return;

        const { fullName, phone } = this.profileForm.value;

        this.userService.updateProfile({ fullName, phone }).subscribe({
            next: () => {
                this.currentUser.fullName = fullName;
                this.currentUser.phone = phone;
                this.authService.updateLocalUser({ fullName, phone });
                this.snackBar.open('Perfil actualizado', 'Cerrar', { duration: 3000 });
            },
            error: (err) => this.snackBar.open('Error al actualizar perfil', 'Cerrar')
        });
    }

    changePassword() {
        if (this.passwordForm.invalid) return;

        const { currentPassword, newPassword } = this.passwordForm.value;

        this.authService.changePassword({ currentPassword, newPassword }).subscribe({
            next: () => {
                this.snackBar.open('Contraseña actualizada correctamente', 'Cerrar', { duration: 3000 });
                this.passwordForm.reset();
            },
            error: (err) => {
                // Mostrar error real del backend (ej. "Contraseña actual incorrecta")
                const msg = err.error || 'Error al cambiar contraseña';
                this.snackBar.open(msg, 'Cerrar', { duration: 5000, panelClass: 'error-snackbar' });
            }
        });
    }

    getInitials(): string {
        return this.currentUser?.fullName?.charAt(0).toUpperCase() || 'U';
    }
}
