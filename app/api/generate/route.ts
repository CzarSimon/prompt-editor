import { type NextRequest, NextResponse } from "next/server"
import { generateText, CoreMessage } from "ai"
import { openai } from "@ai-sdk/openai"
import { Message } from "@/components/previous-messages-editor"

// Models that support reasoning effort
const REASONING_MODELS = ["o3-mini", "o1", "o1-pro"]

export async function POST(req: NextRequest) {
  try {
    const {
      prompt,
      system,
      model = "gpt-4o",
      reasoningEffort,
      apiKey,
      previousMessages = [],
    } = await req.json()

    if (!prompt || !apiKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Set up provider options for reasoning models if reasoning effort is specified
    const providerOptions = {
      openai: {
        apiKey,
        ...(REASONING_MODELS.includes(model) && reasoningEffort ? { reasoningEffort } : {}),
      },
    }

    const messages = [
      ...previousMessages.map((msg: Message) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: prompt },
    ]

    // Generate the response
    const { text } = await generateText({
      model: openai(model),
      messages,
      system,
      providerOptions,
    })

    return NextResponse.json({ text })
  } catch (error) {
    console.error("Error generating response:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate response",
      },
      { status: 500 },
    )
  }
}
