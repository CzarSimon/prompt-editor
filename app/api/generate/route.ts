import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Models that support reasoning effort
const REASONING_MODELS = ["o3-mini", "o1", "o1-pro"]

export async function POST(req: NextRequest) {
  try {
    const { prompt, system, model, reasoningEffort, apiKey } = await req.json()

    if (!prompt || !model || !apiKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Set up provider options for reasoning models if reasoning effort is specified
    const providerOptions =
      REASONING_MODELS.includes(model) && reasoningEffort ? { openai: { reasoningEffort } } : undefined

    const { text } = await generateText({
      model: openai(model),
      prompt,
      system: system || undefined,
      providerOptions,
      credentials: {
        openai: {
          apiKey,
        },
      },
    })

    return NextResponse.json({ text })
  } catch (error) {
    console.error("Error generating text:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate text",
      },
      { status: 500 },
    )
  }
}
