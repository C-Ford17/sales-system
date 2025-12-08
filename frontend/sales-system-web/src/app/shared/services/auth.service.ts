import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { UserDto } from '../models/user';

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

    constructor(private http: HttpClient) { }

    login(payload: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload).pipe(
            tap(res => {
                localStorage.setItem('access_token', res.accessToken);
                localStorage.setItem('refresh_token', res.refreshToken);
                localStorage.setItem('user', JSON.stringify(res.user));
            })
        );
    }

    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    getCurrentUser(): UserDto | null {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
    getUserRole(): string {
        return this.getCurrentUser()?.roleName || '';
    }

}
