"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface ModelSelectorProps {
  selectedModel: string
  setSelectedModel: (model: string) => void
  reasoningEffort?: string
  setReasoningEffort?: (effort: string) => void
}

export default function ModelSelector({
  selectedModel,
  setSelectedModel,
  reasoningEffort = "medium",
  setReasoningEffort = () => {},
}: ModelSelectorProps) {
  const models = [
    { id: "gpt-4o", name: "GPT-4o" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini" },
    { id: "gpt-4.5-preview", name: "GPT-4.5 Preview" },
    { id: "o3-mini", name: "o3-mini" },
    { id: "o1", name: "o1" },
    { id: "o1-pro", name: "o1-pro" },
  ]

  // Models that support reasoning effort
  const reasoningModels = ["o3-mini", "o1", "o1-pro"]

  const [showReasoningEffort, setShowReasoningEffort] = useState(reasoningModels.includes(selectedModel))

  useEffect(() => {
    setShowReasoningEffort(reasoningModels.includes(selectedModel))
  }, [selectedModel])

  const handleModelChange = (value: string) => {
    setSelectedModel(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="model-select">Select Model</Label>
          <Select value={selectedModel} onValueChange={handleModelChange}>
            <SelectTrigger id="model-select">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showReasoningEffort && (
          <div className="space-y-2">
            <Label>Reasoning Effort</Label>
            <RadioGroup value={reasoningEffort} onValueChange={setReasoningEffort} className="flex space-x-2">
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="low" id="effort-low" />
                <Label htmlFor="effort-low" className="cursor-pointer">
                  Low
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="medium" id="effort-medium" />
                <Label htmlFor="effort-medium" className="cursor-pointer">
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="high" id="effort-high" />
                <Label htmlFor="effort-high" className="cursor-pointer">
                  High
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
