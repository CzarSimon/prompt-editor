"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface SystemPromptEditorProps {
  systemPrompt: string
  setSystemPrompt: (systemPrompt: string) => void
  readOnly?: boolean
}

export default function SystemPromptEditor({
  systemPrompt,
  setSystemPrompt,
  readOnly = false,
}: SystemPromptEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Auto-resize the textarea based on content
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [systemPrompt])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSystemPrompt(e.target.value)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <Label htmlFor="system-prompt">System Prompt</Label>
          <textarea
            ref={textareaRef}
            id="system-prompt"
            value={systemPrompt}
            onChange={handleChange}
            onInput={(e) => {
              e.currentTarget.style.height = "auto"
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
            }}
            className="w-full min-h-[200px] p-3 font-mono resize-none border rounded-md"
            placeholder="Enter a system prompt to guide the model's behavior..."
            readOnly={readOnly}
          />
          <p className="text-sm text-muted-foreground">
            The system prompt helps set the behavior and context for the AI model.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
