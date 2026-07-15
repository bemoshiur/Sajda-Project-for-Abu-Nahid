import { UserCog, UserPlus } from 'lucide-react'
import { getRecent } from '@/lib/admin-data'
import { Panel, EmptyState } from '@/components/dashboard/ui'
import { cn } from '@/lib/utils'
import type { User } from '@/payload-types'

export const dynamic = 'force-dynamic'

const ROLE_STYLES: Record<User['role'], string> = {
  superadmin: 'bg-primary/10 text-primary',
  admin: 'bg-primary/10 text-primary',
  manager: 'bg-navy/10 text-navy',
  staff: 'bg-surface-2 text-muted-2',
}

function RoleChip({ role }: { role: User['role'] }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 font-ui text-xs font-semibold capitalize',
        ROLE_STYLES[role] ?? 'bg-surface-2 text-muted-2',
      )}
    >
      {role}
    </span>
  )
}

function ActiveDot({ active }: { active?: boolean | null }) {
  return (
    <span className="inline-flex items-center gap-2 font-ui text-sm">
      <span
        className={cn('h-2 w-2 rounded-full', active ? 'bg-emerald-500' : 'bg-muted-2/50')}
        aria-hidden
      />
      <span className={active ? 'text-navy' : 'text-muted-2'}>{active ? 'Active' : 'Disabled'}</span>
    </span>
  )
}

export default async function UsersPage() {
  const users = await getRecent<User>('users', { limit: 100, sort: '-createdAt', depth: 0 })

  return (
    <div className="flex flex-col gap-6">
      <Panel
        title="Users & Roles"
        action={
          <a
            href="/cms/collections/users/create"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 font-sans text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4" />
            Add user
          </a>
        }
      >
        {users.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No users yet"
              body="Add your first team member to give them access to the admin panel."
              icon={UserCog}
              action={
                <a
                  href="/cms/collections/users/create"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 font-sans text-sm font-semibold text-white transition hover:bg-primary/90"
                >
                  <UserPlus className="h-4 w-4" />
                  Add user
                </a>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-line font-ui text-xs tracking-wide text-muted-2 uppercase">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Active</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 font-body text-sm">
                      <span className="font-sans font-semibold text-navy">{u.name || '—'}</span>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-muted">{u.email}</td>
                    <td className="px-6 py-4 font-body text-sm">
                      <RoleChip role={u.role} />
                    </td>
                    <td className="px-6 py-4 font-body text-sm">
                      <ActiveDot active={u.isActive} />
                    </td>
                    <td className="px-6 py-4 font-body text-sm">
                      <a
                        href={`/cms/collections/users/${u.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-sm font-semibold text-primary hover:underline"
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  )
}
