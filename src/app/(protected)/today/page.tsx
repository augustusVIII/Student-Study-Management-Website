'use client'

import { useEffect, useMemo, useState } from 'react'
import { useToast } from '@/components/ui/toast'
import EditTimeBlockModal from '@/components/EditTimeBlockModal'

type Item = {
  id: string
  startTime: string
  endTime: string
  note?: string | null
  done: boolean
  repeat?: 'WEEKLY' | 'NONE'
  weekday?: 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU' | null
  date?: string | null
  subjectId?: string | null
  subject?: { name: string; color: string } | null
}

const TZ = 'Asia/Ho_Chi_Minh'

/* ---------- time helpers ---------- */
const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const nowMinVN = () => {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: TZ }))
  return d.getHours() * 60 + d.getMinutes()
}
const formatTodayVN = () => {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: TZ }))
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

/* ---------- color helpers ---------- */
function hexToRgb(hex?: string) {
  if (!hex) return { r: 229, g: 231, b: 235 }
  const s = hex.replace('#', '')
  const n =
    s.length === 3
      ? s
          .split('')
          .map((c) => c + c)
          .join('')
      : s.padEnd(6, '0').slice(0, 6)
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  }
}
const tintCss = (hex?: string, a = 0.12) => {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r},${g},${b},${a})`
}
const borderGrad = (
  hex?: string,
) => `linear-gradient(0deg, ${tintCss(hex, 0.0)}, ${tintCss(hex, 0.0)}) padding-box,
linear-gradient(135deg, ${tintCss(hex, 0.0)} 0%, ${tintCss(hex, 0.45)} 60%, ${tintCss(hex, 0.0)} 100%) border-box`

export default function TodayPage() {
  const { error, success } = useToast()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [tick, setTick] = useState(0)

  const [editing, setEditing] = useState<Item | null>(null)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/today', { cache: 'no-store' })
    if (res.ok) setItems(await res.json())
    else error('Không tải được danh sách hôm nay.')
    setLoading(false)
  }
  useEffect(() => {
    load()
  }, [])

  // refresh nhãn theo phút
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 60 * 1000)
    return () => clearInterval(t)
  }, [])

  async function toggle(id: string, done: boolean) {
    const res = await fetch('/api/today/complete', {
      method: 'POST',
      body: JSON.stringify({ timeBlockId: id, done }),
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) error('Cập nhật trạng thái thất bại.')
    await load()
  }

  /* ---------- phân nhóm ---------- */
  const now = useMemo(() => nowMinVN(), [tick])
  const sorted = useMemo(
    () => [...items].sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [items],
  )

  const ongoing: Item[] = [],
    upcoming: Item[] = [],
    done: Item[] = []
  for (const i of sorted) {
    if (i.done) {
      done.push(i)
      continue
    }
    const s = toMin(i.startTime),
      e = toMin(i.endTime)
    if (now >= s && now < e) ongoing.push(i)
    else if (now < s) upcoming.push(i)
    else upcoming.push(i)
  }

  const total = items.length
  const completed = items.filter((x) => x.done).length
  const percent = total ? Math.round((completed / total) * 100) : 0

  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Hôm nay</h1>
          <div className="text-sm text-gray-600">{formatTodayVN()}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="min-w-[200px]">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Tiến độ</span>
              <span>
                {completed}/{total} · {percent}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
          <button
            onClick={load}
            className="px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50 text-sm"
            disabled={loading}
          >
            {loading ? 'Đang tải…' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Empty state */}
      {!loading && total === 0 && (
        <div className="rounded-2xl border border-dashed p-10 text-center text-gray-600 bg-white">
          Chưa có lịch cho hôm nay. Hãy tạo ở mục <span className="font-medium">New</span> hoặc lên
          lịch <span className="font-medium">Week</span>.
        </div>
      )}

      {/* Sections */}
      {ongoing.length > 0 && (
        <Section title="Đang diễn ra" accent="bg-emerald-500/20 text-emerald-800">
          {ongoing.map((i) => (
            <Card key={i.id} item={i} onToggle={toggle} onEdit={() => setEditing(i)} highlight />
          ))}
        </Section>
      )}

      {upcoming.length > 0 && (
        <Section title="Sắp tới" accent="bg-amber-500/20 text-amber-800">
          {upcoming.map((i) => (
            <Card key={i.id} item={i} onToggle={toggle} onEdit={() => setEditing(i)} />
          ))}
        </Section>
      )}

      {done.length > 0 && (
        <Section title="Đã xong" accent="bg-slate-400/20 text-slate-800">
          {done.map((i) => (
            <Card key={i.id} item={i} onToggle={toggle} onEdit={() => setEditing(i)} muted />
          ))}
        </Section>
      )}

      {/* EDIT MODAL */}
      {editing && (
        <EditTimeBlockModal
          open={!!editing}
          onClose={() => setEditing(null)}
          initial={{
            id: editing.id,
            subjectId: editing.subjectId ?? null,
            repeat: (editing.repeat ?? 'WEEKLY') as any,
            weekday: (editing.weekday ?? null) as any,
            date: editing.date ?? null,
            startTime: editing.startTime,
            endTime: editing.endTime,
            note: editing.note ?? null,
            subject: editing.subject ?? null,
          }}
          onChanged={() => {
            setEditing(null)
            load()
            success('Đã cập nhật.')
          }}
        />
      )}
    </main>
  )
}

/* ---------- UI sub-components ---------- */

function Section({
  title,
  children,
  accent,
}: {
  title: string
  children: React.ReactNode
  accent: string
}) {
  return (
    <section className="space-y-3">
      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs ${accent}`}>
        <span className="font-semibold tracking-wide">{title}</span>
      </div>
      <div className="grid grid-cols-1 gap-3">{children}</div>
    </section>
  )
}

function Card({
  item,
  onToggle,
  onEdit,
  muted = false,
  highlight = false,
}: {
  item: Item
  onToggle: (id: string, done: boolean) => void
  onEdit: () => void
  muted?: boolean
  highlight?: boolean
}) {
  const hex = item.subject?.color ?? '#e5e7eb'
  const bgTint = tintCss(hex, muted ? 0.06 : 0.1)

  return (
    <div
      className={`group relative rounded-2xl p-3 md:p-4 transition-all bg-white/90 backdrop-blur
                  hover:shadow-[0_6px_24px_-8px_rgba(0,0,0,0.15)]
                  ${muted ? 'opacity-70' : ''}`}
      style={{
        border: '1px solid transparent',
        background: `linear-gradient(0deg, ${bgTint}, ${bgTint}), #fff`,
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
      }}
    >
      {/* viền gradient bao quanh */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          padding: 1,
          background: borderGrad(hex),
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor' as any,
          maskComposite: 'exclude' as any,
        }}
      />

      {/* thanh tiến trình mảnh khi đang diễn ra */}
      {highlight && !item.done && (
        <div className="absolute left-3 right-3 top-2 h-[3px] rounded-full bg-black/5 overflow-hidden">
          <div className="h-[3px] bg-blue-600/80 animate-[progress_6s_linear_infinite]" />
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* dải màu & icon trạng thái */}
        <div className="relative shrink-0">
          <div className="h-12 w-2 rounded-full" style={{ background: hex }} />
          {item.done ? (
            <div className="absolute -left-2 -top-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          ) : (
            <div className="absolute -left-2 -top-1 h-3.5 w-3.5 rounded-full bg-gray-300 ring-2 ring-white" />
          )}
        </div>

        {/* nội dung */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* time chip */}
            <span className="inline-flex items-center gap-1 rounded-full border bg-white/80 px-2 py-[3px] text-[12px] text-gray-800">
              <svg width="14" height="14" viewBox="0 0 24 24" className="opacity-70">
                <path
                  d="M12 7v5l3 3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {item.startTime}–{item.endTime}
            </span>

            {/* status */}
            {item.done && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-[3px] text-[11px] text-emerald-700">
                ✓ xong
              </span>
            )}
          </div>

          {/* subject */}
          <div
            className={`mt-1 text-[15px] font-semibold leading-tight truncate ${item.done ? 'line-through text-gray-500' : 'text-gray-900'}`}
            title={item.subject?.name ?? 'No subject'}
          >
            {item.subject?.name ?? 'No subject'}
          </div>

          {/* note */}
          {item.note && (
            <div className="mt-1 text-[12px] text-gray-600 line-clamp-2">{item.note}</div>
          )}
        </div>

        {/* actions */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={onEdit}
            className="h-8 px-2.5 rounded-lg border text-xs bg-white hover:bg-gray-50"
            title="Sửa"
          >
            Sửa
          </button>
          <button
            onClick={() => onToggle(item.id, !item.done)}
            className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors
                        ${
                          item.done
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
          >
            {item.done ? 'Hoàn tác' : '✓ Done'}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}
