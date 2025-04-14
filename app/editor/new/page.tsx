"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { saveTemplate } from "@/lib/template-storage"
import PromptEditor from "@/components/prompt-editor"
import SystemPromptEditor from "@/components/system-prompt-editor"

export default function NewTemplatePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [template, setTemplate] = useState("Write a $type about $topic.")
  const [systemPrompt, setSystemPrompt] = useState("")
  const [editorMode, setEditorMode] = useState<"template" | "system">("template")

  const handleCreate = () => {
    try {
      const newTemplate = saveTemplate({
        name: name || "Untitled Template",
        template,
        systemPrompt,
      })
      toast({
        title: "Template Created",
        description: "Your template has been created successfully.",
      })
      router.push(`/editor/${newTemplate.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create the template.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Template</h1>
        <Button variant="outline" onClick={() => router.push("/templates")}>
          Back to Templates
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for your template"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-end mb-2">
              <div className="inline-flex rounded-md shadow-sm">
                <Button
                  variant={editorMode === "template" ? "default" : "outline"}
                  onClick={() => setEditorMode("template")}
                  className="rounded-r-none"
                >
                  Template
                </Button>
                <Button
                  variant={editorMode === "system" ? "default" : "outline"}
                  onClick={() => setEditorMode("system")}
                  className="rounded-l-none"
                >
                  System Prompt
                </Button>
              </div>
            </div>

            {editorMode === "template" ? (
              <PromptEditor template={template} setTemplate={setTemplate} />
            ) : (
              <SystemPromptEditor systemPrompt={systemPrompt} setSystemPrompt={setSystemPrompt} />
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleCreate}>Create Template</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
