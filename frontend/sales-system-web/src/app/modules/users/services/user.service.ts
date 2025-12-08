import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
    id: string;
    fullName: string;
    email: string;
    roleName: string;
    roleId: string;
    status: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
    private apiUrl = 'http://localhost:5062/api/users'; // Ajusta puerto

    constructor(private http: HttpClient) { }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    createUser(user: any): Observable<any> {
        return this.http.post(this.apiUrl, user);
    }

    updateUser(id: string, user: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, user);
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
    getRoles(): Observable<any[]> {
        return this.http.get<any[]>('http://localhost:5062/api/roles');
    }
    updateProfile(data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/profile`, data);
    }
}
