import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ApiService, Task } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { firstValueFrom } from 'rxjs';

type Status = 'Todo' | 'InProgress' | 'Done';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './tasks.html',
})
export class Tasks {
  loading = false;
  error: string | null = null;

  // UI state
  query = signal('');
  category = signal('All');
  sort = signal<'position' | 'createdAt' | 'title'>('position');

  // Create form
  newTitle = '';
  newDescription = '';
  newCategory = 'General';

  tasks = signal<Task[]>([]);
  connectedDropListIds: Status[] = ['Todo', 'InProgress', 'Done'];


  user = computed(() => this.auth.getUser());
  role = computed(() => this.user()?.role ?? null);
  canWrite = computed(() => {
    const r = this.role();
    return r === 'Owner' || r === 'Admin';
  });

  constructor(private api: ApiService, private auth: AuthService) {}

  readonly columns: { key: Status; label: string }[] = [
    { key: 'Todo', label: 'Todo' },
    { key: 'InProgress', label: 'In Progress' },
    { key: 'Done', label: 'Done' },
  ];

  tasksFor(status: Status): Task[] {
    return this.byStatus(status);
  }

  countFor(status: Status): number {
    return this.byStatus(status).length;
  }

  trackById(_: number, t: Task) {
    return t.id;
  }

  async ngOnInit() {
    console.log('Tasks mounted');
    await this.refresh();
  }

  async refresh() {
    this.loading = true;
    this.error = null;

    console.log('refresh() starting');

    try {
      const obs = this.api.listTasks();
      console.log('listTasks() observable', obs);

      // this.tasks = await firstValueFrom(obs);
      this.tasks.set(await firstValueFrom(obs));
      console.log('tasks loaded', this.tasks().length);
    } catch (e: any) {
      console.log('refresh() error', e);
      this.error = 'Failed to load tasks.';
    } finally {
      this.loading = false;
      console.log('refresh() done');
    }
  }


  // Derived
  categories = computed(() => {
    const set = new Set<string>(this.tasks().map(t => t.category || 'General'));
    return ['All', ...Array.from(set).sort()];
  });

  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const cat = this.category();
    const sort = this.sort();

    let arr = [...this.tasks()];

    if (cat !== 'All') arr = arr.filter(t => (t.category || 'General') === cat);

    if (q) {
      arr = arr.filter(t =>
        (t.title || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
      );
    }

    if (sort === 'title') {
      arr.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'createdAt') {
      arr.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      arr.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    }

    return arr;
  });


  byStatus = (status: Status) =>
    this.filtered().filter(t => t.status === status);

  idsForStatus = (status: Status) =>
    this.byStatus(status).map(t => t.id);

  summary = computed(() => {
    const all = this.filtered(); // or this.tasks() if you want it unaffected by search/filter
    const todo = all.filter(t => t.status === 'Todo').length;
    const inprog = all.filter(t => t.status === 'InProgress').length;
    const done = all.filter(t => t.status === 'Done').length;
    const total = all.length || 1;

    return {
      todo,
      inprog,
      done,
      total,
      todoPct: Math.round((todo / total) * 100),
      inprogPct: Math.round((inprog / total) * 100),
      donePct: Math.round((done / total) * 100),
    };
  });

  // CRUD
  async create(status: Status = 'Todo') {
    if (!this.canWrite()) return;

    const title = this.newTitle.trim();
    if (!title) return;

    try {
      const created = await firstValueFrom(
        this.api.createTask({
          title,
          description: this.newDescription.trim() || undefined,
          category: this.newCategory.trim() || 'General',
          status,
        })
      );
      this.tasks.update(tasks => [...tasks, created]);
      this.newTitle = '';
      this.newDescription = '';
    } catch {
      this.error = 'Failed to create task.';
    }
  }

  async setStatus(task: Task, status: Status) {
    if (!this.canWrite()) return;
    if (task.status === status) return;

    try {
      const updated = await firstValueFrom(this.api.updateTask(task.id, { status }));
      this.tasks.set(this.tasks().map(t => (t.id === task.id ? updated : t)));
    } catch {
      this.error = 'Failed to update task.';
    }
  }

  async remove(task: Task) {
    if (!this.canWrite()) return;

    try {
      await firstValueFrom(this.api.deleteTask(task.id));
      this.tasks.set(this.tasks().filter(t => t.id !== task.id));
    } catch {
      this.error = 'Failed to delete task.';
    }
  }

  // Drag/drop: update status + reassign positions in the target column
  async drop(status: Status, event: CdkDragDrop<Task[]>) {
    if (!this.canWrite()) return;

    const prev = event.previousContainer.data; // actual array for prev column
    const curr = event.container.data;         // actual array for target column

    if (event.previousContainer === event.container) {
      moveItemInArray(curr, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(prev, curr, event.previousIndex, event.currentIndex);
    }

    // Persist the target column order + status
    try {
      const ops: Promise<Task>[] = [];

      curr.forEach((t, idx) => {
        const patch: any = { position: idx };
        if (t.status !== status) patch.status = status;
        ops.push(firstValueFrom(this.api.updateTask(t.id, patch)));
      });

      const updated = await Promise.all(ops);
      const updatedMap = new Map(updated.map(t => [t.id, t]));

      // Merge updates into the canonical tasks signal
      this.tasks.update(all => all.map(t => updatedMap.get(t.id) ?? t));
    } catch {
      this.error = 'Failed to reorder tasks.';
      await this.refresh();
    }
  }

}
