import type { Access, FieldAccess } from 'payload'

/**
 * Reusable access-control helpers.
 *
 * Two auth collections exist:
 *  - `users`     → staff/admin (role: superadmin | admin | manager | staff)
 *  - `customers` → storefront end-users
 * `req.user.collection` distinguishes them.
 */

type StaffRole = 'superadmin' | 'admin' | 'manager' | 'staff'

const staffRoles: StaffRole[] = ['superadmin', 'admin', 'manager', 'staff']

/** Is the request made by an authenticated staff member? */
export const isStaffUser = (user: unknown): boolean => {
  if (!user || typeof user !== 'object') return false
  const u = user as { collection?: string; role?: string; isActive?: boolean }
  return u.collection === 'users' && staffRoles.includes(u.role as StaffRole) && u.isActive !== false
}

const hasStaffRole = (user: unknown, roles: StaffRole[]): boolean => {
  if (!isStaffUser(user)) return false
  const u = user as { role?: string }
  return roles.includes(u.role as StaffRole)
}

/** Public — anyone, logged in or not. */
export const anyone: Access = () => true

/** Any authenticated principal (staff or customer). */
export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/** Any staff member. */
export const isStaff: Access = ({ req: { user } }) => isStaffUser(user)

/** Manager and above. */
export const isManager: Access = ({ req: { user } }) =>
  hasStaffRole(user, ['superadmin', 'admin', 'manager'])

/** Admin and above. */
export const isAdmin: Access = ({ req: { user } }) => hasStaffRole(user, ['superadmin', 'admin'])

/** Super admin only. */
export const isSuperAdmin: Access = ({ req: { user } }) => hasStaffRole(user, ['superadmin'])

/** Field-level: admin and above. */
export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) =>
  hasStaffRole(user, ['superadmin', 'admin'])

/** Field-level: any staff member. */
export const isStaffFieldLevel: FieldAccess = ({ req: { user } }) => isStaffUser(user)

/**
 * Staff see everything; a customer sees only rows where `<ownerField>` equals their id.
 * Use on collections owned by a customer (bookings, invoices, enquiries…).
 */
export const isStaffOrOwnedByCustomer =
  (ownerField = 'customer'): Access =>
  ({ req: { user } }) => {
    if (isStaffUser(user)) return true
    if (user && (user as { collection?: string }).collection === 'customers') {
      return { [ownerField]: { equals: (user as { id: string | number }).id } }
    }
    return false
  }

/**
 * Public read gated by publication status: staff see all rows; everyone else
 * sees only rows where `status` equals `statusValue` (e.g. 'published', 'approved').
 */
export const readByStatusOrStaff =
  (statusValue: string): Access =>
  ({ req: { user } }) => {
    if (isStaffUser(user)) return true
    return { status: { equals: statusValue } }
  }

/** A customer may act on their own account row; staff on any. */
export const isStaffOrSelf: Access = ({ req: { user } }) => {
  if (isStaffUser(user)) return true
  if (user && (user as { collection?: string }).collection === 'customers') {
    return { id: { equals: (user as { id: string | number }).id } }
  }
  return false
}
