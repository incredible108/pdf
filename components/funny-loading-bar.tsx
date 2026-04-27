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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className={cn("w-full max-w-md mx-4 bg-card rounded-xl border shadow-2xl p-8 space-y-6", className)}>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Crafting Your Resume</h3>
          <p className="text-sm text-muted-foreground">Please wait while we work our magic...</p>
        </div>

        <div className="space-y-2">
          <Progress value={progress} className="h-4" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className="font-mono">{Math.round(progress)}%</span>
            <span>Almost there...</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="flex gap-2">
            <span className="animate-bounce text-3xl" style={{ animationDelay: "0s" }}>🤖</span>
            <span className="animate-bounce text-3xl" style={{ animationDelay: "0.1s" }}>📝</span>
            <span className="animate-bounce text-3xl" style={{ animationDelay: "0.2s" }}>✨</span>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-center text-sm font-medium text-foreground animate-pulse min-h-[1.5rem]">
            {displayedMessage}
          </p>
        </div>

        <div className="flex justify-center gap-2 pt-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          This may take a moment. Good things come to those who wait!
        </p>
      </div>
    </div>
  )
}
