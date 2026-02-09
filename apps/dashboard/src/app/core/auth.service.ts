import { Injectable } from '@angular/core';

const TOKEN_KEY = 'access_token';

export type JwtUser = {
  sub: string;
  role: 'Owner' | 'Admin' | 'Viewer';
  organizationId: string;
  email: string;
  iat: number;
  exp: number;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  clear() {
    localStorage.removeItem(TOKEN_KEY);
  }

  getUser(): JwtUser | null {
    const token = this.getToken();
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    try {
      const payload = JSON.parse(atob(parts[1])) as JwtUser;
      return payload;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
