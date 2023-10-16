import type { IRole } from '@/models/i-user';

export type AuthRouteKey = 'user-create' | 'user-update' | 'user-delete' | 'user-enable';

export const authRouteMap: { key: AuthRouteKey, allowedRoles: IRole[] }[] = [
  { key: 'user-create', allowedRoles: ['ADMIN', 'ROOT'] },
  { key: 'user-update', allowedRoles: ['ADMIN', 'ROOT'] },
  { key: 'user-delete', allowedRoles: ['ADMIN', 'ROOT'] },
];
