import { getCurrentCustomer } from '@/lib/auth'
import { Panel } from '@/components/dashboard/ui'
import { ProfileForm } from '@/components/dashboard/ProfileForm'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const customer = await getCurrentCustomer()
  if (!customer) return null
  const addr = customer.address ?? {}

  return (
    <Panel title="My Profile">
      <div className="p-6">
        <ProfileForm
          values={{
            name: customer.name ?? '',
            email: customer.email,
            phone: customer.phone ?? '',
            line1: addr.line1 ?? '',
            city: addr.city ?? '',
            country: addr.country ?? '',
            postcode: addr.postcode ?? '',
            passportNumber: customer.passportNumber ?? '',
          }}
        />
      </div>
    </Panel>
  )
}
