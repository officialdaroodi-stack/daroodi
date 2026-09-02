/**
 * Client-safe auth types and helpers.
 * For server-only operations (getCurrentUser, listAllUsers, etc.) use:
 *   - `@/lib/auth-server` — current user, role check (uses next/headers)
 *   - `@/lib/auth-admin`  — service-role operations (bypasses RLS)
 */
import { UserRole } from '@/lib/types';

export type AuthUser = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
};
