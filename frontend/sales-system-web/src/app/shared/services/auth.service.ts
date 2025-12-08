import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { UserDto } from '../models/user';
import { BehaviorSubject } from 'rxjs';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: UserDto;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
    currentUser$ = this.currentUserSubject.asObservable();
    private getUserFromStorage() {
        const user = localStorage.getItem('user_data');
        return user ? JSON.parse(user) : null;
    }

    constructor(private http: HttpClient) { }

    login(payload: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload).pipe(
            tap(res => {
                localStorage.setItem('access_token', res.accessToken);
                localStorage.setItem('refresh_token', res.refreshToken);
                localStorage.setItem('user', JSON.stringify(res.user));
                localStorage.setItem('user_data', JSON.stringify(res.user));
                this.currentUserSubject.next(res.user);
            })
        );
    }

    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    getCurrentUser() {
        return this.currentUserSubject.value;
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
    getUserRole(): string {
        return this.getCurrentUser()?.roleName || '';
    }
    changePassword(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/change-password`, data);
    }
    updateLocalUser(data: any) {
        const current = this.getCurrentUser();
        if (current) {
            const updated = { ...current, ...data };
            localStorage.setItem('user_data', JSON.stringify(updated));

            // Emitir el nuevo valor a todos los suscriptores
            this.currentUserSubject.next(updated);
        }
    }

}
