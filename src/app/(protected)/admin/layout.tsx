import { RoleGate } from '@/components/auth/role-gate'
import { ERouteTable } from '@/constants/route'
import { auth } from '@/lib/auth/auth'
import { UserRole } from '@prisma/client'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) {
    // Chuyển hướng nếu chưa đăng nhập
    redirect(ERouteTable.SIGIN_IN)
  }

  return <RoleGate allowedRole={UserRole.ADMIN}>{children}</RoleGate>
}
