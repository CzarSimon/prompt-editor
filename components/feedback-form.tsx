"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface FeedbackFormProps {
  feedback: string
  setFeedback: (feedback: string) => void
}

export default function FeedbackForm({ feedback, setFeedback }: FeedbackFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="feedback">Provide feedback to improve the template</Label>
          <Textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What would you like to improve about the response? Be specific about what you liked or didn't like."
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  )
}
