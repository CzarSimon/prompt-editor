"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PopulatedPreviewProps {
  populatedPrompt: string
}

export default function PopulatedPreview({ populatedPrompt }: PopulatedPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Prompt</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap bg-muted p-4 rounded-md min-h-[300px] font-mono">
          {populatedPrompt || "Your populated prompt will appear here after filling in all variables."}
        </div>
      </CardContent>
    </Card>
  )
}
