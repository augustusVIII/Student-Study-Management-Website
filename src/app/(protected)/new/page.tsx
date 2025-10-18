'use client'

import EnhancedTimeBlockForm from '@/components/TimeBlockForm'

export default function NewPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tạo TimeBlock</h1>
        <p className="text-sm text-gray-600">
          Chọn môn học và thời gian để thêm vào thời khóa biểu.
        </p>
      </div>
      <EnhancedTimeBlockForm />
    </div>
  )
}
