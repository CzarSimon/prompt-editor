"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { saveTemplate } from "@/lib/template-storage"

export default function NewTemplatePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [template, setTemplate] = useState("Write a $type about $topic.")
  const [systemPrompt, setSystemPrompt] = useState("")

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
            <Label htmlFor="template">Template</Label>
            <textarea
              id="template"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full min-h-[200px] p-3 border rounded-md font-mono"
              placeholder="Enter your template. Use $variable_name syntax for variables."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="systemPrompt">System Prompt (Optional)</Label>
            <textarea
              id="systemPrompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full min-h-[100px] p-3 border rounded-md font-mono"
              placeholder="Enter a system prompt (optional)"
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleCreate}>Create Template</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
