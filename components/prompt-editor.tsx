"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { extractVariables } from "@/lib/template-utils"

interface PromptEditorProps {
  template: string
  setTemplate: (template: string) => void
  readOnly?: boolean
}

export default function PromptEditor({ template, setTemplate, readOnly = false }: PromptEditorProps) {
  const [highlightedTemplate, setHighlightedTemplate] = useState<string>("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    highlightVariables()

    // Auto-resize the textarea based on content
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [template])

  const highlightVariables = () => {
    const variables = extractVariables(template)
    let highlighted = template

    variables.forEach((variable) => {
      const regex = new RegExp(`\\$${variable}`, "g")
      highlighted = highlighted.replace(
        regex,
        `<span class="bg-blue-100 text-blue-800 px-1 rounded">${variable}</span>`,
      )
    })

    setHighlightedTemplate(highlighted)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTemplate(e.target.value)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <Label htmlFor="prompt-template">Prompt Template</Label>
          <div className="relative border rounded-md overflow-hidden">
            <textarea
              ref={textareaRef}
              id="prompt-template"
              value={template}
              onChange={handleChange}
              onInput={(e) => {
                e.currentTarget.style.height = "auto"
                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
              }}
              className="w-full min-h-[300px] p-3 font-mono text-transparent bg-transparent caret-black dark:caret-white resize-none overflow-hidden"
              placeholder="Enter your prompt template here. Use $variable_name syntax for variables."
              readOnly={readOnly}
            />
            <div
              className="absolute top-0 left-0 w-full h-full p-3 font-mono pointer-events-none whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: highlightedTemplate }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Use <code>$variable_name</code> syntax to define variables in your template.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
