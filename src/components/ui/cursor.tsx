import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [followerPosition, setFollowerPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      
      // Smooth follower movement
      requestAnimationFrame(() => {
        setFollowerPosition({
          x: followerPosition.x + (e.clientX - followerPosition.x) * 0.2,
          y: followerPosition.y + (e.clientY - followerPosition.y) * 0.2
        })
      })
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.classList.contains('hoverable')) {
        setIsHovering(true)
      }
    }

    const handleMouseLeave = (e: MouseEvent) => {
      setIsHovering(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [followerPosition, isMobile])

  if (isMobile) return null

  return (
    <>
      <div
        className={`cursor ${isHovering ? 'hover' : ''}`}
        style={{
          transform: `translate(${position.x - 10}px, ${position.y - 10}px)`,
        }}
      />
      <div
        className={`cursor-follower ${isHovering ? 'hover' : ''}`}
        style={{
          transform: `translate(${followerPosition.x - 4}px, ${followerPosition.y - 4}px)`,
        }}
      />
    </>
  )
} 