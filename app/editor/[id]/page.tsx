"use client"

import { CardContent } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PromptEditor from "@/components/prompt-editor"
import SystemPromptEditor from "@/components/system-prompt-editor"
import VariableForm from "@/components/variable-form"
import ModelSelector from "@/components/model-selector"
import ResponseDisplay from "@/components/response-display"
import FeedbackForm from "@/components/feedback-form"
import ApiKeyForm from "@/components/api-key-form"
import PopulatedPreview from "@/components/populated-preview"
import PreviousMessagesEditor, { Message } from "@/components/previous-messages-editor"
import { extractVariables } from "@/lib/template-utils"
import { useToast } from "@/components/ui/use-toast"
import { getTemplate, updateTemplate } from "@/lib/template-storage"

// Models that support reasoning effort
const REASONING_MODELS = ["o3-mini", "o1", "o1-pro"]

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const { id } = use(params)
  const [apiKey, setApiKey] = useState<string>("")
  const [template, setTemplate] = useState<string>("Write a $type about $topic.")
  const [systemPrompt, setSystemPrompt] = useState<string>("")
  const [editorMode, setEditorMode] = useState<"template" | "system">("template")
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [extractedVars, setExtractedVars] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o")
  const [reasoningEffort, setReasoningEffort] = useState<string>("medium")
  const [populatedPrompt, setPopulatedPrompt] = useState<string>("")
  const [response, setResponse] = useState<string>("")
  const [feedback, setFeedback] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [improvedTemplate, setImprovedTemplate] = useState<string>("")
  const [improvedSystemPrompt, setImprovedSystemPrompt] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("editor")
  const [templateName, setTemplateName] = useState<string>("")
  const [previousMessages, setPreviousMessages] = useState<Message[]>([])

  console.log("EditorPage.variables", variables);

  useEffect(() => {
    if (id !== "new") {
      const savedTemplate = getTemplate(id)
      if (savedTemplate) {
        setTemplate(savedTemplate.template)
        setSystemPrompt(savedTemplate.systemPrompt || "")
        setTemplateName(savedTemplate.name)
        setPreviousMessages(savedTemplate.previousMessages || [])
        // Load saved variables if they exist
        if (savedTemplate.variables) {
          setVariables(savedTemplate.variables)
        }
      } else {
        toast({
          title: "Template Not Found",
          description: "The requested template could not be found.",
          variant: "destructive",
        })
        router.push("/templates")
      }
    }
  }, [id, router, toast])

  useEffect(() => {
    const vars = extractVariables(template)
    setExtractedVars(vars)

    // Initialize variables object with empty strings for any new variables
    // but preserve existing values from saved variables
    const newVars = { ...variables }
    vars.forEach((v) => {
      if (!(v in newVars)) {
        newVars[v] = ""
      }
    })

    // Remove any variables that are no longer in the template
    Object.keys(newVars).forEach((key) => {
      if (!vars.includes(key)) {
        delete newVars[key]
      }
    })

    const storedVariables = getTemplate(id)?.variables || {}
    const updatedVariables = getStoredValuesForVariables(newVars, storedVariables)
    setVariables(updatedVariables)
  }, [template])

  // Update populated prompt whenever variables change
  useEffect(() => {
    setPopulatedPrompt(populateTemplate())
  }, [variables, template])

  const populateTemplate = () => {
    let populated = template
    Object.entries(variables).forEach(([key, value]) => {
      populated = populated.replace(new RegExp(`\\$${key}`, "g"), value)
    })
    return populated
  }

  const saveTemplate = () => {
    try {
      if (id === "new") {
        // Create new template
        const newTemplate = {
          name: templateName || "Untitled Template",
          template,
          systemPrompt,
          previousMessages,
          variables,
        }
        updateTemplate(id, newTemplate)
        toast({
          title: "Template Saved",
          description: "Your template has been saved successfully.",
        })
      } else {
        // Update existing template
        updateTemplate(id, {
          name: templateName,
          template,
          systemPrompt,
          previousMessages,
          variables,
        })
        toast({
          title: "Template Updated",
          description: "Your template has been updated successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the template.",
        variant: "destructive",
      })
    }
  }

  const goToPreview = () => {
    // Check if all variables are filled
    if (Object.values(variables).some((v) => v === "") && extractedVars.length > 0) {
      toast({
        title: "Missing Variables",
        description: "Please fill in all variables before previewing the prompt.",
        variant: "destructive",
      })
      return
    }

    setActiveTab("preview")
  }

  const runPrompt = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to run the prompt.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: populatedPrompt,
          system: systemPrompt,
          model: selectedModel,
          reasoningEffort: REASONING_MODELS.includes(selectedModel) ? reasoningEffort : undefined,
          apiKey,
          previousMessages,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate response")
      }

      const data = await response.json()
      setResponse(data.text)
      setActiveTab("response")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const improveTemplate = async () => {
    if (!apiKey || !feedback || !response) {
      toast({
        title: "Missing Information",
        description: "Please ensure you have an API key, a response, and feedback before improving the template.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/improve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalTemplate: template,
          originalSystemPrompt: systemPrompt,
          response,
          feedback,
          apiKey,
          model: selectedModel,
          reasoningEffort: REASONING_MODELS.includes(selectedModel) ? reasoningEffort : undefined,
          previousMessages,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to improve template")
      }

      const data = await res.json()
      setImprovedTemplate(data.improvedTemplate)
      setImprovedSystemPrompt(data.improvedSystemPrompt || "")
      setActiveTab("improved")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const applyImprovedTemplate = () => {
    setTemplate(improvedTemplate)
    if (improvedSystemPrompt) {
      setSystemPrompt(improvedSystemPrompt)
    }
    setImprovedTemplate("")
    setImprovedSystemPrompt("")
    setActiveTab("editor")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Prompt Editor</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={saveTemplate}>
            Save Template
          </Button>
          <Button variant="outline" onClick={() => router.push("/templates")}>
            Back to Templates
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <ApiKeyForm apiKey={apiKey} setApiKey={setApiKey} />
          <ModelSelector
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            reasoningEffort={reasoningEffort}
            setReasoningEffort={setReasoningEffort}
          />
        </div>

        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-6 mb-4">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="variables">Variables</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
              <TabsTrigger value="improved">Improved</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Template Name"
                  className="px-3 py-2 border rounded-md"
                />
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

              <Button onClick={() => setActiveTab("variables")}>Next: Fill Variables</Button>
            </TabsContent>

            <TabsContent value="messages" className="space-y-4">
              <PreviousMessagesEditor
                messages={previousMessages}
                setMessages={setPreviousMessages}
              />
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("editor")}>
                  Back to Editor
                </Button>
                <Button onClick={() => setActiveTab("variables")}>Next: Fill Variables</Button>
              </div>
            </TabsContent>

            <TabsContent value="variables" className="space-y-4">
              <VariableForm variables={variables} setVariables={setVariables} extractedVars={extractedVars} />
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("messages")}>
                  Back to Messages
                </Button>
                <Button onClick={goToPreview}>Next: Preview Prompt</Button>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              {systemPrompt && (
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>System Prompt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap bg-muted p-4 rounded-md font-mono">{systemPrompt}</div>
                  </CardContent>
                </Card>
              )}

              {previousMessages.length > 0 && (
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>Previous Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
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
                  </CardContent>
                </Card>
              )}

              <PopulatedPreview populatedPrompt={populatedPrompt} />
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("variables")}>
                  Back to Variables
                </Button>
                <Button onClick={runPrompt} disabled={isLoading}>
                  {isLoading ? "Running..." : "Run Prompt"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="response" className="space-y-4">
              <ResponseDisplay response={response} />
              <FeedbackForm feedback={feedback} setFeedback={setFeedback} />
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("preview")}>
                  Back to Preview
                </Button>
                <Button onClick={improveTemplate} disabled={isLoading || !feedback}>
                  {isLoading ? "Improving..." : "Improve Template"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="improved" className="space-y-4">
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
                <PromptEditor template={improvedTemplate} setTemplate={setImprovedTemplate} readOnly={true} />
              ) : (
                <SystemPromptEditor
                  systemPrompt={improvedSystemPrompt}
                  setSystemPrompt={setImprovedSystemPrompt}
                  readOnly={true}
                />
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("response")}>
                  Back to Response
                </Button>
                <Button onClick={applyImprovedTemplate}>Apply Improved Template</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


function getStoredValuesForVariables(
  variables: Record<string, string>,
  storedVariables: Record<string, string>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(variables).map(([key, value]) => {
      return [key, storedVariables[key] || value]
    })
  )
}
