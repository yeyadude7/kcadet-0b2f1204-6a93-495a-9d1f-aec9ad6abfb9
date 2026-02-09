export type Permission =
  | 'task:read'
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'audit:read';

export const RolePermissions: Record<string, Permission[]> = {
  Owner: [
    'task:read',
    'task:create',
    'task:update',
    'task:delete',
    'audit:read',
  ],
  Admin: [
    'task:read',
    'task:create',
    'task:update',
    'task:delete',
    'audit:read',
  ],
  Viewer: ['task:read'],
};
