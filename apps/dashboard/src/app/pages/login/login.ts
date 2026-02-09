import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class Login {
  email = 'owner@acme.com';
  password = 'Password123!';
  loading = false;
  error: string | null = null;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
  ) {}

  fill(email: string) {
    this.email = email;
    this.password = 'Password123!';
    this.error = null;
  }

  async submit() {
    this.loading = true;
    this.error = null;

    try {
      const res = await this.api.login(this.email, this.password).toPromise();
      if (!res?.accessToken) throw new Error('Missing token');

      this.auth.setToken(res.accessToken);
      await this.router.navigateByUrl('/board');
    } catch (e: any) {
      this.error = 'Invalid credentials or server unavailable.';
    } finally {
      this.loading = false;
    }
  }
}
