import SiteHeader from '@/components/SiteHeader'
import { ToastProvider } from '@/components/ui/toast'
import { ERouteTable } from '@/constants/route'
import { auth } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) redirect(ERouteTable.SIGIN_IN)

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastProvider>
        <SiteHeader />
        <main className="mx-auto max-w-7xl py-6 px-4">{children}</main>
      </ToastProvider>
    </div>
  )
}
