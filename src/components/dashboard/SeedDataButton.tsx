'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Database, Loader2, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SeedDataButton() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSeed = async () => {
    if (!confirm('Bạn có chắc chắn muốn tạo dữ liệu mẫu không? Hành động này sẽ thêm 5 bài viết mới vào Database.')) return

    setLoading(true)
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
        router.refresh()
      } else {
        const error = await response.json()
        alert('Lỗi: ' + error.error)
      }
    } catch (err) {
      alert('Đã có lỗi xảy ra khi gọi API.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleSeed} 
      disabled={loading}
      className="gap-2"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : success ? (
        <CheckCircle2 className="w-4 h-4 text-green-600" />
      ) : (
        <Database className="w-4 h-4" />
      )}
      {loading ? 'Đang tạo...' : success ? 'Thành công!' : 'Tạo bài viết mẫu'}
    </Button>
  )
}
