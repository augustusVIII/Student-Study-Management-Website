// src/app/(protected)/week/page.tsx
import WeekView from '@/components/WeekView'
import { headers } from 'next/headers'

async function getWeek(start?: string) {
  const h: any = await headers()
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const base = `${proto}://${host}`
  const url = `${base}/api/week${start ? `?start=${encodeURIComponent(start)}` : ''}`

  const res = await fetch(url, {
    cache: 'no-store',
    headers: { cookie: h.get('cookie') ?? '', accept: 'application/json' },
  })

  const ct = res.headers.get('content-type') ?? ''
  if (!ct.includes('application/json')) {
    const txt = await res.text()
    console.error('API /api/week không trả JSON:', res.status, txt.slice(0, 200))
    throw new Error('API /api/week không trả JSON.')
  }

  if (!res.ok) return { weekly: [], oneOff: [], weekStartVN: new Date().toISOString() }
  return res.json()
}

export default async function WeekPage() {
  const { weekly, oneOff, weekStartVN } = await getWeek()
  return (
    <main className="p-6 space-y-5">
      <h1 className="text-2xl font-bold">Lịch tuần</h1>
      <WeekView initialWeekly={weekly} initialOneOff={oneOff} initialWeekStartUTC={weekStartVN} />
    </main>
  )
}
