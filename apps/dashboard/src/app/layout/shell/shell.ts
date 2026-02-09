import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shell.html',
})
export class Shell {
  constructor(public auth: AuthService, private router: Router) {}

  user = computed(() => this.auth.getUser());
  role = computed(() => this.user()?.role ?? null);
  email = computed(() => this.user()?.email ?? null);

  canSeeAudit = computed(() => {
    const r = this.role();
    return r === 'Owner' || r === 'Admin';
  });

  logout() {
    this.auth.clear();
    this.router.navigateByUrl('/login');
  }
}
