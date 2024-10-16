import React, { useState, useRef, useEffect } from 'react'
import { GripHorizontal } from 'lucide-react'

const ChatBox: React.FC = () => {
  const [size, setSize] = useState({ width: 300, height: 400 })
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [isResizing, setIsResizing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [showDragHandle, setShowDragHandle] = useState(false)
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const resizeStartPos = useRef({ x: 0, y: 0 })
  const dragStartPos = useRef({ x: 0, y: 0 })
  const resizeDirection = useRef('')

  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>, direction: string) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    resizeStartPos.current = { x: e.clientX, y: e.clientY }
    resizeDirection.current = direction
  }

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return

    const deltaX = e.clientX - resizeStartPos.current.x
    const deltaY = e.clientY - resizeStartPos.current.y

    setSize(prevSize => {
      let newWidth = prevSize.width
      let newHeight = prevSize.height

      if (resizeDirection.current.includes('e')) newWidth = prevSize.width + deltaX
      if (resizeDirection.current.includes('w')) newWidth = prevSize.width - deltaX
      if (resizeDirection.current.includes('s')) newHeight = prevSize.height + deltaY
      if (resizeDirection.current.includes('n')) newHeight = prevSize.height - deltaY

      return {
        width: Math.max(200, newWidth),
        height: Math.max(200, newHeight)
      }
    })

    if (resizeDirection.current.includes('w')) {
      setPosition(prev => ({ ...prev, x: prev.x + deltaX }))
    }
    if (resizeDirection.current.includes('n')) {
      setPosition(prev => ({ ...prev, y: prev.y + deltaY }))
    }

    resizeStartPos.current = { x: e.clientX, y: e.clientY }
  }

  const handleResizeEnd = () => {
    setIsResizing(false)
  }

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && !e.target.classList.contains('drag-handle')) return
    setIsDragging(true)
    dragStartPos.current = { x: e.clientX - position.x, y: e.clientY - position.y }
  }

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStartPos.current.x,
      y: e.clientY - dragStartPos.current.y
    })
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(event.target as Node)) {
        setShowDragHandle(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('mousemove', handleResizeMove)
    document.addEventListener('mouseup', handleResizeEnd)
    document.addEventListener('mousemove', handleDragMove)
    document.addEventListener('mouseup', handleDragEnd)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('mousemove', handleResizeMove)
      document.removeEventListener('mouseup', handleResizeEnd)
      document.removeEventListener('mousemove', handleDragMove)
      document.removeEventListener('mouseup', handleDragEnd)
    }
  }, [isResizing, isDragging])

  return (
    <div
      ref={chatBoxRef}
      className="absolute bg-white rounded-lg shadow-lg overflow-hidden"
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
      onClick={() => setShowDragHandle(true)}
    >
      <div
        className="bg-blue-600 text-white p-2 cursor-move drag-handle flex items-center justify-between"
        onMouseDown={handleDragStart}
      >
        <span>Chat</span>
        {showDragHandle && <GripHorizontal size={20} />}
      </div>
      <div className="p-4 h-[calc(100%-40px)] overflow-y-auto">
        {/* Chat content goes here */}
        <p>Start your conversation here...</p>
      </div>
      <div
        className="absolute top-0 left-0 w-2 h-full cursor-ew-resize"
        onMouseDown={(e) => handleResizeStart(e, 'w')}
      />
      <div
        className="absolute top-0 right-0 w-2 h-full cursor-ew-resize"
        onMouseDown={(e) => handleResizeStart(e, 'e')}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize"
        onMouseDown={(e) => handleResizeStart(e, 's')}
      />
      <div
        className="absolute top-0 left-0 w-full h-2 cursor-ns-resize"
        onMouseDown={(e) => handleResizeStart(e, 'n')}
      />
      <div
        className="absolute top-0 left-0 w-2 h-2 cursor-nwse-resize"
        onMouseDown={(e) => handleResizeStart(e, 'nw')}
      />
      <div
        className="absolute top-0 right-0 w-2 h-2 cursor-nesw-resize"
        onMouseDown={(e) => handleResizeStart(e, 'ne')}
      />
      <div
        className="absolute bottom-0 left-0 w-2 h-2 cursor-nesw-resize"
        onMouseDown={(e) => handleResizeStart(e, 'sw')}
      />
      <div
        className="absolute bottom-0 right-0 w-2 h-2 cursor-nwse-resize"
        onMouseDown={(e) => handleResizeStart(e, 'se')}
      />
    </div>
  )
}

export default ChatBox