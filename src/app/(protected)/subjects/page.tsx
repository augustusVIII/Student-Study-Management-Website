'use client'

import { useToast } from '@/components/ui/toast'
import { useEffect, useMemo, useState } from 'react'

type Subject = { id: string; name: string; color: string }

const pastel = () => {
  // random pastel HSL -> hex
  const h = Math.floor(Math.random() * 360)
  const s = 70
  const l = 70

  const clamp255 = (n: number) => Math.max(0, Math.min(255, n))
  const toHex = (n: number) => clamp255(n).toString(16).padStart(2, '0')

  const a = s * Math.min(l / 100, 1 - l / 100)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const col = l / 100 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * col) // có thể hơi <0 hoặc >255 -> đã clamp ở toHex
  }

  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`
}

export default function SubjectsPage() {
  const [items, setItems] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [q, setQ] = useState('')

  const { success, error } = useToast()

  async function createOne(name: string, color: string) {
    setBusy(true)
    const res = await fetch('/api/subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    })
    setBusy(false)
    if (!res.ok) {
      error('Tạo thất bại (cần route POST /api/subjects).')
      return
    }
    success('Đã thêm môn học.')
    load()
  }

  async function updateOne(id: string, patch: Partial<Pick<Subject, 'name' | 'color'>>) {
    setBusy(true)
    const res = await fetch(`/api/subjects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    } as any)
    setBusy(false)
    if (!res.ok) {
      error('Sửa thất bại (hãy tạo route PATCH /api/subjects/[id]).')
      return
    }
    success('Đã cập nhật.')
    load()
  }

  async function removeOne(id: string) {
    if (!confirm('Xóa môn học này?')) return
    const res = await fetch(`/api/subjects/${id}`, { method: 'DELETE' } as any)
    if (!res.ok) {
      error('Xóa thất bại (hãy tạo route DELETE /api/subjects/[id]).')
      return
    }
    setItems((prev) => prev.filter((x) => x.id !== id))
    success('Đã xóa.')
  }

  async function load() {
    setLoading(true)
    const res = await fetch('/api/subjects', { cache: 'no-store' })
    if (res.ok) setItems(await res.json())
    setLoading(false)
  }
  useEffect(() => {
    load()
  }, [])

  // ---- filter/search ----
  const filtered = useMemo(() => {
    if (!q.trim()) return items
    const kw = q.toLowerCase()
    return items.filter((s) => s.name.toLowerCase().includes(kw))
  }, [items, q])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Subjects</h1>
          <p className="text-sm text-gray-600">Quản lý danh sách môn học và màu nhận diện.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm môn học…"
            className="h-9 w-56 rounded-lg border px-3 text-sm bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={load}
            className="h-9 rounded-lg border px-3 text-sm bg-white hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Quick Add */}
      <QuickAdd onCreate={createOne} busy={busy} />

      {/* Grid */}
      {loading ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <EmptyState onCreate={createOne} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <SubjectCard
              key={s.id}
              data={s}
              onDelete={() => removeOne(s.id)}
              onSave={(p) => updateOne(s.id, p)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ================= SUB-COMPONENTS ================ */

function QuickAdd({
  onCreate,
  busy,
}: {
  onCreate: (name: string, color: string) => void
  busy: boolean
}) {
  const [name, setName] = useState('')
  // GIỮ GIÁ TRỊ ỔN ĐỊNH KHI SSR, SAU ĐÓ MỚI RANDOM
  const [color, setColor] = useState('#eeeeee')

  useEffect(() => {
    setColor(pastel()) // chạy chỉ trên client sau hydrate -> không mismatch
  }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onCreate(name.trim(), color)
    setName('')
    setColor(pastel()) // gọi sau hydrate -> OK
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border bg-white p-4 flex flex-wrap items-center gap-3"
    >
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg border" style={{ background: color }} />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-8 w-10 rounded cursor-pointer border bg-white"
          title="Chọn màu"
        />
      </div>
      {/* ...phần còn lại giữ nguyên... */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên môn học (VD: Toán, Lý, Hóa…) "
        className="flex-1 min-w-[220px] h-10 rounded-lg border px-3 text-sm bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <button
        disabled={busy}
        className="h-10 rounded-lg bg-blue-600 text-white px-4 text-sm disabled:opacity-60"
      >
        {busy ? 'Đang thêm…' : 'Thêm môn'}
      </button>
    </form>
  )
}

function SubjectCard({
  data,
  onDelete,
  onSave,
}: {
  data: Subject
  onDelete: () => void
  onSave: (p: Partial<Pick<Subject, 'name' | 'color'>>) => void
}) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(data.name)
  const [color, setColor] = useState(data.color)

  const save = () => {
    if (!name.trim()) return
    if (name !== data.name || color !== data.color) onSave({ name: name.trim(), color })
    setEditing(false)
  }

  return (
    <div className="group relative rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition">
      {/* banner màu */}
      <div className="absolute inset-x-0 top-0 h-2 rounded-t-2xl" style={{ background: color }} />
      {/* nội dung */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-lg border" style={{ background: color }} />
          <div className="min-w-0">
            {editing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border px-2 py-1 text-sm"
              />
            ) : (
              <div className="font-semibold text-gray-900 truncate">{data.name}</div>
            )}
            <div className="text-xs text-gray-500">
              Màu:&nbsp;
              {editing ? (
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-5 w-8 align-middle border rounded"
                />
              ) : (
                <code className="px-1.5 py-[2px] rounded bg-gray-100">{data.color}</code>
              )}
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          {editing ? (
            <>
              <button
                onClick={save}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm"
              >
                Lưu
              </button>
              <button
                onClick={() => {
                  setEditing(false)
                  setName(data.name)
                  setColor(data.color)
                }}
                className="px-3 py-1.5 rounded-lg border text-sm bg-white"
              >
                Hủy
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="px-3 py-1.5 rounded-lg border text-sm bg-white hover:bg-gray-50"
              >
                Sửa
              </button>
              <button
                onClick={onDelete}
                className="px-3 py-1.5 rounded-lg text-sm bg-red-50 text-red-600 hover:bg-red-100"
              >
                Xóa
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border bg-white p-4 animate-pulse">
          <div className="h-2 w-24 bg-gray-200 rounded mb-4" />
          <div className="h-9 w-9 bg-gray-200 rounded-lg mb-2" />
          <div className="h-3 w-40 bg-gray-200 rounded mb-2" />
          <div className="h-8 w-28 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ onCreate }: { onCreate: (name: string, color: string) => void }) {
  // KHÔNG random trong render; dùng fallback ổn định, random sau hydrate
  const [seed, setSeed] = useState<string | null>(null)

  useEffect(() => {
    setSeed(pastel())
  }, [])

  const colorPreview = seed ?? '#dddddd'

  return (
    <div className="rounded-2xl border border-dashed bg-white p-10 text-center">
      <div className="mx-auto mb-3 h-10 w-10 rounded-xl" style={{ background: colorPreview }} />
      <div className="text-gray-700 font-semibold">Chưa có môn học</div>
      <div className="text-gray-500 text-sm mb-4">
        Thêm môn đầu tiên để bắt đầu lập thời khóa biểu.
      </div>
      <button
        onClick={() => onCreate('Môn mới', seed ?? pastel())} // lúc click là client, gọi pastel() an toàn
        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm"
      >
        Thêm nhanh “Môn mới”
      </button>
    </div>
  )
}
