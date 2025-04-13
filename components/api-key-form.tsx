"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon } from "lucide-react"

interface ApiKeyFormProps {
  apiKey: string
  setApiKey: (apiKey: string) => void
}

export default function ApiKeyForm({ apiKey, setApiKey }: ApiKeyFormProps) {
  const [showApiKey, setShowApiKey] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>OpenAI API Key</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="api-key">Your API Key</Label>
          <div className="flex">
            <Input
              id="api-key"
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="ml-2"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Your API key is used only for requests and is not stored on our servers.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
