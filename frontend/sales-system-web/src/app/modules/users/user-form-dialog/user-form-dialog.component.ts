import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { UserService, User } from '../services/user.service';

@Component({
  selector: 'app-user-form-dialog',
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
  templateUrl: './user-form-dialog.component.html',
  styleUrls: ['./user-form-dialog.component.css']
})
export class UserFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  public dialogRef = inject(MatDialogRef<UserFormDialogComponent>);

  @Inject(MAT_DIALOG_DATA) public data: User | null = null; // Inyección manual si falla inject()

  userForm: FormGroup;
  isEditMode: boolean = false;
  hidePassword = true;

  // Roles hardcodeados por ahora (lo ideal es traerlos del backend)
  // Asegúrate de usar los IDs correctos de tu BD. 
  // Puedes hacer un endpoint GET /api/roles o copiarlos de tu tabla Roles.
  roles = [
    { id: 'bd6c7706-e740-420a-a92c-6347047f3b48', name: 'Admin' },
    { id: '2c33292c-0e36-4122-8178-54c348981446', name: 'Supervisor' }, // Ejemplo
    { id: '4560f796-03c0-425f-bc98-6750058b8d96', name: 'Employee' }   // Ejemplo
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public userData: User | null) {
    this.data = userData;
    this.isEditMode = !!this.data;

    this.userForm = this.fb.group({
      fullName: [this.data?.fullName || '', [Validators.required]],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      roleId: [this.data?.roleId || '', [Validators.required]],
      // Password es required solo si es nuevo
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      status: [this.data?.status || 'active']
    });
  }

  ngOnInit() {
    this.userService.getRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  onSave() {
    if (this.userForm.invalid) return;

    const formValue = this.userForm.value;

    if (this.isEditMode && this.data) {
      // Al editar, si password está vacío, no lo enviamos (o el backend lo ignora)
      if (!formValue.password) delete formValue.password;

      this.userService.updateUser(this.data.id, formValue).subscribe({
        next: (res) => this.dialogRef.close(res),
        error: (err) => alert('Error al actualizar: ' + err.message)
      });
    } else {
      this.userService.createUser(formValue).subscribe({
        next: (res) => this.dialogRef.close(res),
        error: (err) => alert('Error al crear: ' + err.message)
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
