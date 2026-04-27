"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const FUNNY_MESSAGES = [
  "Brewing coffee for the AI...",
  "Teaching robots to read resumes...",
  "Convincing AI that you're hireable...",
  "Polishing your achievements...",
  "Making you sound more impressive...",
  "Calculating optimal buzzword density...",
  "Translating your skills to recruiter-speak...",
  "Sprinkling some magic keywords...",
  "Convincing ATS you're not a robot...",
  "Optimizing synergy levels...",
  "Aligning career chakras...",
  "Downloading more RAM for better results...",
  "Asking ChatGPT's cousin for help...",
  "Inflating job titles professionally...",
  "Converting imposter syndrome to confidence...",
  "Generating impressive-sounding metrics...",
  "Making 'helped team' sound like 'led initiative'...",
  "Turning meetings into 'stakeholder alignment'...",
  "Rebranding procrastination as 'strategic prioritization'...",
  "Almost there... probably...",
  "Still working... AI is thinking very hard...",
  "This is taking a while... must be a good resume!",
]

interface FunnyLoadingBarProps {
  isLoading: boolean
  className?: string
}

export function FunnyLoadingBar({ isLoading, className }: FunnyLoadingBarProps) {
  const [progress, setProgress] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const [displayedMessage, setDisplayedMessage] = useState("")

  // Animate progress bar with random increments
  useEffect(() => {
    if (!isLoading) {
      setProgress(0)
      setMessageIndex(0)
      setDisplayedMessage("")
      return
    }

    // Start with initial message
    setDisplayedMessage(FUNNY_MESSAGES[0])

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        // Slow down as we approach 90% to simulate realistic loading
        if (prev >= 90) return Math.min(prev + 0.5, 95)
        if (prev >= 70) return prev + Math.random() * 2
        if (prev >= 50) return prev + Math.random() * 3
        return prev + Math.random() * 5
      })
    }, 300)

    return () => clearInterval(progressInterval)
  }, [isLoading])

  // Rotate through funny messages
  useEffect(() => {
    if (!isLoading) return

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => {
        const newIndex = (prev + 1) % FUNNY_MESSAGES.length
        setDisplayedMessage(FUNNY_MESSAGES[newIndex])
        return newIndex
      })
    }, 3000)

    return () => clearInterval(messageInterval)
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div className={cn("space-y-4 py-6", className)}>
      <div className="space-y-2">
        <Progress value={progress} className="h-3" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{Math.round(progress)}%</span>
          <span>Generating your amazing resume...</span>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-3 py-4">
        <div className="flex gap-1">
          <span className="animate-bounce delay-0 text-2xl">🤖</span>
          <span className="animate-bounce delay-75 text-2xl" style={{ animationDelay: "0.1s" }}>📝</span>
          <span className="animate-bounce delay-150 text-2xl" style={{ animationDelay: "0.2s" }}>✨</span>
        </div>
      </div>

      <p className="text-center text-sm font-medium text-foreground animate-pulse">
        {displayedMessage}
      </p>

      <div className="flex justify-center gap-1.5 pt-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-primary animate-pulse"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}
