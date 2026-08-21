import { UserRole } from './types';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 100,
  admin: 90,
  dev_frontend: 80,
  dev_backend: 80,
  product_manager: 70,
  finance_manager: 70,
  marketing_admin: 70,
  country_sales_manager: 50,
  product_editor: 40,
  order_checker: 40,
  regional_sales_agent: 30,
  customer: 10,
};

export function hasRole(currentRole: UserRole | undefined, requiredRoles: UserRole[]): boolean {
  if (!currentRole) return false;
  if (currentRole === 'super_admin') return true; // Super Admin has universal override
  return requiredRoles.includes(currentRole);
}

export function canManageUsers(role: UserRole | undefined): boolean {
  return role === 'super_admin' || role === 'admin';
}

export function canManageProducts(role: UserRole | undefined): boolean {
  return (
    role === 'super_admin' ||
    role === 'admin' ||
    role === 'product_manager' ||
    role === 'product_editor' ||
    role === 'dev_frontend'
  );
}

export function canManageOrders(role: UserRole | undefined): boolean {
  return (
    role === 'super_admin' ||
    role === 'admin' ||
    role === 'product_manager' ||
    role === 'order_checker'
  );
}

export function canManageFinance(role: UserRole | undefined): boolean {
  return role === 'super_admin' || role === 'admin' || role === 'finance_manager';
}

export function canManageMarketing(role: UserRole | undefined): boolean {
  return (
    role === 'super_admin' ||
    role === 'admin' ||
    role === 'marketing_admin' ||
    role === 'country_sales_manager'
  );
}

export function isDeveloper(role: UserRole | undefined): boolean {
  return (
    role === 'super_admin' ||
    role === 'dev_frontend' ||
    role === 'dev_backend'
  );
}

export function canEditCMS(role: UserRole | undefined): boolean {
  return (
    role === 'super_admin' ||
    role === 'admin' ||
    role === 'dev_frontend' ||
    role === 'marketing_admin'
  );
}

export function getRoleDisplayName(role: UserRole): string {
  const map: Record<UserRole, string> = {
    super_admin: '👑 Super Admin',
    admin: '🛡️ Admin',
    dev_frontend: '🎨 Frontend / CMS Dev',
    dev_backend: '⚙️ Backend System Dev',
    product_manager: '🛍️ Product Manager',
    product_editor: '✏️ Product Editor',
    order_checker: '🔍 Order Checker',
    finance_manager: '💰 Finance Manager',
    marketing_admin: '📢 Marketing Admin',
    country_sales_manager: '🗺️ Country Sales Head',
    regional_sales_agent: '📍 Regional Sales Agent',
    customer: '👤 Customer',
  };
  return map[role] || role;
}
