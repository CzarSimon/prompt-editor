import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Models that support reasoning effort
const REASONING_MODELS = ["o3-mini", "o1", "o1-pro"]

export async function POST(req: NextRequest) {
  try {
    const {
      originalTemplate,
      originalSystemPrompt,
      response,
      feedback,
      apiKey,
      model = "gpt-4o",
      reasoningEffort,
    } = await req.json()

    if (!originalTemplate || !response || !feedback || !apiKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Set up provider options for reasoning models if reasoning effort is specified
    const providerOptions =
      REASONING_MODELS.includes(model) && reasoningEffort ? { openai: { reasoningEffort } } : undefined

    // Improve the template
    const systemPromptForTemplateImprovement = `
  You are an expert prompt engineer. Your task is to improve a prompt template based on user feedback.
  The template uses $variable_name syntax for variables. Preserve all variables from the original template.
  You may add new variables if needed, but ensure they are clearly explained.
  Focus on making the prompt more effective based on the user's feedback.
`

    const userPromptForTemplateImprovement = `
  Original Template: ${originalTemplate}
  
  ${originalSystemPrompt ? `System Prompt: ${originalSystemPrompt}` : ""}
  
  Response Generated: ${response}
  
  User Feedback: ${feedback}
  
  Please provide an improved version of the original template that addresses the feedback.
  Keep the same variable structure using $variable_name syntax.
  Only return the improved template text, nothing else.
`

    const { text: improvedTemplate } = await generateText({
      model: openai(model || "gpt-4o"),
      system: systemPromptForTemplateImprovement,
      prompt: userPromptForTemplateImprovement,
      providerOptions,
      credentials: {
        openai: {
          apiKey,
        },
      },
    })

    // If there's a system prompt, improve it too
    let improvedSystemPrompt = ""
    if (originalSystemPrompt) {
      const systemPromptForSystemImprovement = `
    You are an expert prompt engineer. Your task is to improve a system prompt based on user feedback.
    Focus on making the system prompt more effective based on the user's feedback.
  `

      const userPromptForSystemImprovement = `
    Original Template: ${originalTemplate}
    
    Original System Prompt: ${originalSystemPrompt}
    
    Response Generated: ${response}
    
    User Feedback: ${feedback}
    
    Please provide an improved version of the system prompt that addresses the feedback.
    Only return the improved system prompt text, nothing else.
  `

      const { text: systemImprovement } = await generateText({
        model: openai(model || "gpt-4o"),
        system: systemPromptForSystemImprovement,
        prompt: userPromptForSystemImprovement,
        providerOptions,
        credentials: {
          openai: {
            apiKey,
          },
        },
      })

      improvedSystemPrompt = systemImprovement
    }

    return NextResponse.json({ improvedTemplate, improvedSystemPrompt })
  } catch (error) {
    console.error("Error improving template:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to improve template",
      },
      { status: 500 },
    )
  }
}
