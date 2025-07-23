import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const body = await req.json()
  const { name, height, weight, goal, limitations } = body

  const prompt = `
You are a helpful and health-conscious AI assistant. The user is named ${name} and their goal is to ${goal.replace("_", " ")}.
They are ${height} inches tall, weigh ${weight} lbs, and have this limitation: ${limitations || "none"}.

Based on this, suggest a healthy 7-day meal plan. Make sure to provide:
- Breakfast
- Lunch
- Dinner

Format it like this:

Day 1 - Breakfast: ..., Lunch: ..., Dinner: ...
Day 2 - Breakfast: ..., Lunch: ..., Dinner: ...
... (repeat for 7 days)

Only return the meal plan text. Do not include anything else.
`

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })

    const reply = chatCompletion.choices[0].message.content?.trim()

    return NextResponse.json({ mealPlan: reply || "Meal plan not available." })
  } catch (error) {
    console.error("Meal Plan Error:", error)
    return NextResponse.json(
      { mealPlan: "⚠️ Could not generate meal plan. Please try again later." },
      { status: 500 }
    )
  }
}

