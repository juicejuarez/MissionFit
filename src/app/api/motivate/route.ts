import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const body = await req.json()
  const { name, height, weight, goal, limitations, planLength } = body

  const prompt = `
You are a motivating fitness assistant. The user's name is ${name}, height is ${height}, weight is ${weight}, goal is ${goal.replace("_", " ")}, and limitations are ${limitations || "none"}.

Provide a personalized fitness plan with:
- A recommended activity tailored to the user's goal and limitations.
- A ${planLength}-day workout plan summary.

- A short motivational message.

Respond in this strict JSON format (no extra text):

{
  "activity": "personalized activity here",
  "weeklyPlan": "day-by-day workout summary",
  "message": "motivational message"
}
  `.trim()

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })

    const raw = chatCompletion.choices[0].message.content

    let parsed
    try {
      parsed = JSON.parse(raw || "")
    } catch (e) {
      console.error("❌ Failed to parse OpenAI response as JSON:", e, "\nRaw content:\n", raw)
      parsed = {
        activity: "N/A",
        weeklyPlan: "N/A",
        message: raw || "Unable to generate response."
      }
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("OpenAI API error:", error)
    return NextResponse.json(
      { activity: "N/A", weeklyPlan: "N/A", message: "Something went wrong" },
      { status: 500 }
    )
  }
}

