"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ResponseDisplayProps {
  response: string
}

export default function ResponseDisplay({ response }: ResponseDisplayProps) {
  if (!response) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Response</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Run your prompt to see the response here.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">{response}</div>
      </CardContent>
    </Card>
  )
}
