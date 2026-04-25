'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Bookmark } from 'lucide-react'
import { toggleBookmark } from '@/app/posts/actions/bookmark-actions'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface BookmarkButtonProps {
  postId: string
  initialIsBookmarked: boolean
}

export function BookmarkButton({ postId, initialIsBookmarked }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsLoading(true)
    try {
      const result = await toggleBookmark(postId)
      if (result.success) {
        setIsBookmarked(result.isBookmarked || false)
        router.refresh()
      } else if (result.error) {
        alert(result.error)
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
      alert('Vui lòng đăng nhập để lưu bài viết!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "rounded-full transition-all active:scale-90",
        isBookmarked ? "text-indigo-600 bg-indigo-50" : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
      )}
      onClick={handleToggle}
      disabled={isLoading}
    >
      <Bookmark 
        className={cn("w-5 h-5", isBookmarked && "fill-current")} 
      />
    </Button>
  )
}
