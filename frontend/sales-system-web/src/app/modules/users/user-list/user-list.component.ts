import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { UserService, User } from '../services/user.service';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  users: User[] = [];
  displayedColumns = ['avatar', 'name', 'email', 'role', 'status', 'actions'];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error(err)
    });
  }

  openUserDialog(user?: User) {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: user || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadUsers(); // Recargar lista al cerrar
    });
  }

  deleteUser(user: User) {
    if (confirm(`¿Estás seguro de eliminar a ${user.fullName}?`)) {
      this.userService.deleteUser(user.id).subscribe(() => this.loadUsers());
    }
  }

  // Helper para clases de badges
  getRoleClass(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin': return 'badge-purple';
      case 'supervisor': return 'badge-blue';
      default: return 'badge-gray';
    }
  }
}
