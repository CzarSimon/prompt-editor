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
import PreviousMessagesEditor, { Message } from "@/components/previous-messages-editor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NewTemplatePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [template, setTemplate] = useState("Write a $type about $topic.")
  const [systemPrompt, setSystemPrompt] = useState("")
  const [editorMode, setEditorMode] = useState<"template" | "system">("template")
  const [previousMessages, setPreviousMessages] = useState<Message[]>([])
  const [activeTab, setActiveTab] = useState<string>("editor")

  const handleCreate = () => {
    try {
      const newTemplate = saveTemplate({
        name: name || "Untitled Template",
        template,
        systemPrompt,
        previousMessages,
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="messages">Previous Messages</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="messages" className="space-y-4">
              <PreviousMessagesEditor
                messages={previousMessages}
                setMessages={setPreviousMessages}
              />
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Template Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Template</h3>
                    <div className="p-3 bg-muted rounded-md whitespace-pre-wrap font-mono">
                      {template}
                    </div>
                  </div>

                  {systemPrompt && (
                    <div>
                      <h3 className="font-semibold mb-2">System Prompt</h3>
                      <div className="p-3 bg-muted rounded-md whitespace-pre-wrap font-mono">
                        {systemPrompt}
                      </div>
                    </div>
                  )}

                  {previousMessages.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Previous Messages</h3>
                      <div className="space-y-2">
                        {previousMessages.map((message, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-md ${message.role === "user"
                              ? "bg-blue-50 dark:bg-blue-900/20"
                              : message.role === "assistant"
                                ? "bg-green-50 dark:bg-green-900/20"
                                : "bg-purple-50 dark:bg-purple-900/20"
                              }`}
                          >
                            <div className="font-semibold text-sm mb-1 capitalize">
                              {message.role}
                            </div>
                            <div className="text-sm whitespace-pre-wrap">
                              {message.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button onClick={handleCreate}>Create Template</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
