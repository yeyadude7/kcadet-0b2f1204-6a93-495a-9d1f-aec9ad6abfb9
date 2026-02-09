import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { firstValueFrom } from 'rxjs';

type AuditRow = {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  result: 'ALLOW' | 'DENY';
  reason: string | null;
  ip: string | null;
};


@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit.html',
})
export class Audit {
  loading = signal(false);
  error = signal<string | null>(null);
  rows = signal<AuditRow[]>([]);

  user = computed(() => this.auth.getUser());
  role = computed(() => this.user()?.role ?? null);
  email = computed(() => this.user()?.email ?? null);

  constructor(private api: ApiService, private auth: AuthService) {}

  async ngOnInit() {
    await this.refresh();
  }

  async refresh() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const data = await firstValueFrom(this.api.listAuditLogs());
      const rows = (data as AuditRow[])
        .slice()
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      this.rows.set(rows);
    } catch (e: any) {
      this.error.set('Unable to load audit logs (insufficient permissions or server error).');
    } finally {
      this.loading.set(false);
    }
  }

}
