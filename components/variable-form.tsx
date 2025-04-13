"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface VariableFormProps {
  variables: Record<string, string>
  setVariables: (variables: Record<string, string>) => void
  extractedVars: string[]
}

export default function VariableForm({ variables, setVariables, extractedVars }: VariableFormProps) {
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({})

  useEffect(() => {
    // Resize all textareas on initial render
    Object.keys(variables).forEach((key) => {
      const textarea = textareaRefs.current[key]
      if (textarea) {
        textarea.style.height = "auto"
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    })
  }, [variables])

  const handleChange = (variable: string, value: string) => {
    setVariables({
      ...variables,
      [variable]: value,
    })
  }

  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    // Auto-resize the textarea
    e.currentTarget.style.height = "auto"
    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
  }

  if (extractedVars.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            No variables found in the template. Add variables using the <code>$variable_name</code> syntax.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fill in Variables</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {extractedVars.map((variable) => (
            <div key={variable} className="space-y-2">
              <Label htmlFor={`var-${variable}`}>{variable}</Label>
              <Textarea
                id={`var-${variable}`}
                ref={(el) => (textareaRefs.current[variable] = el)}
                value={variables[variable] || ""}
                onChange={(e) => handleChange(variable, e.target.value)}
                onInput={handleTextareaInput}
                placeholder={`Enter value for ${variable}`}
                className="min-h-[80px] resize-none"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
