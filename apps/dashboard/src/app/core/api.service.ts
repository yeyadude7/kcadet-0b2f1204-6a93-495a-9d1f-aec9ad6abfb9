import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API = 'http://localhost:3000/api';

export type LoginResponse = { accessToken: string };

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  status: 'Todo' | 'InProgress' | 'Done';
  position: number;
  organizationId: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskDto = {
  title: string;
  description?: string;
  category: string;
  status: 'Todo' | 'InProgress' | 'Done';
};

export type UpdateTaskDto = Partial<CreateTaskDto> & { position?: number };

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${API}/auth/login`, { email, password });
  }

  listTasks() {
    return this.http.get<Task[]>(`${API}/tasks`);
  }

  createTask(dto: CreateTaskDto) {
    return this.http.post<Task>(`${API}/tasks`, dto);
  }

  updateTask(id: string, dto: UpdateTaskDto) {
    return this.http.put<Task>(`${API}/tasks/${id}`, dto);
  }

  deleteTask(id: string) {
    return this.http.delete<{ deleted: boolean }>(`${API}/tasks/${id}`);
  }

  listAuditLogs() {
    return this.http.get<any[]>(`${API}/audit-log`);
  }
}
