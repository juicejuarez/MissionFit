"use client"

import { useState } from "react"
import UserForm from "./components/UserForm"

interface UserData {
  name: string
  height: number | string
  weight: number | string
  goal: string
  limitations?: string
  planLength?: string
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [motivation, setMotivation] = useState("")
  const [activity, setActivity] = useState("")
  const [weeklyPlan, setWeeklyPlan] = useState("")
  const [loading, setLoading] = useState(false)
  const [showMealQuestion, setShowMealQuestion] = useState(false)
  const [showMealFetchButton, setShowMealFetchButton] = useState(false)
  const [mealPlan, setMealPlan] = useState<string[]>([])
  const [showStartOver, setShowStartOver] = useState(false)

  const handleUserSubmit = async (data: UserData) => {
    setUserData(data)
    setLoading(true)
    setMotivation("")
    setActivity("")
    setWeeklyPlan("")
    setMealPlan([])
    setShowMealQuestion(false)
    setShowMealFetchButton(false)
    setShowStartOver(false)

    try {
      const res = await fetch("/api/motivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      const result = await res.json()
      setActivity(result.activity)
      setWeeklyPlan(result.weeklyPlan)
      setMotivation(result.message)
      setShowMealQuestion(true)
    } catch (error) {
      console.error("Error fetching motivation:", error)
      setMotivation("⚠️ Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Step 1: Does user want a meal plan?
  const handleMealChoice = (choice: "yes" | "no") => {
    setShowMealQuestion(false)
    if (choice === "no") {
      setShowStartOver(true)
      return
    }
    setShowMealFetchButton(true)
  }

  // Step 2: Fetch the meal plan on demand
  const fetchMealPlan = async () => {
    if (!userData) return
    setLoading(true)
    try {
      const res = await fetch("/api/mealprep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      })

      const result = await res.json()

      // Assuming result.mealPlan is a string with days separated by new lines or "Day X:" labels
      // Parse and split it for display:
      const lines = result.mealPlan
        .split(/\n|Day \d+:?/)
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0)

      setMealPlan(lines)
    } catch (error) {
      console.error("Error fetching meal plan:", error)
      setMealPlan(["⚠️ Could not load meal plan."])
    } finally {
      setLoading(false)
      setShowMealFetchButton(false)
      setShowStartOver(true)
    }
  }

  const handleReset = () => {
    setUserData(null)
    setMotivation("")
    setActivity("")
    setWeeklyPlan("")
    setMealPlan([])
    setShowMealQuestion(false)
    setShowMealFetchButton(false)
    setShowStartOver(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-fuchsia-200 flex items-center justify-center p-4">
      {!userData ? (
        <UserForm onSubmit={handleUserSubmit} />
      ) : (
        <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto bg-white p-8 md:p-10 lg:p-12 rounded-2xl shadow-xl space-y-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {userData.name}!</h1>
          <p className="text-gray-900 text-lg">🎯 Goal: {userData.goal.replace("_", " ")}</p>
          <p className="text-gray-900">📏 Height: {userData.height}</p>
          <p className="text-gray-900">⚖️ Weight: {userData.weight}</p>
          <p className="text-gray-900">🩺 Limitations: {userData.limitations || "None"}</p>

          {loading ? (
            <p className="mt-4 text-indigo-600 font-medium">⏳ Generating your MissionFit plan...</p>
          ) : (
            <>
              <div className="text-left space-y-2">
                <p className="text-gray-900 font-semibold"><strong>💡 Recommended Activity:</strong> {activity}</p>
                <p className="text-gray-900 whitespace-pre-line"><strong>📅 Weekly Workout Plan:</strong><br />{weeklyPlan}</p>
                <p className="text-indigo-900 font-semibold">{motivation}</p>
              </div>

              {showMealQuestion && (
                <>
                  <p className="mt-4 font-medium text-gray-900">Would you like a meal plan suggestion for the week? 🍽️</p>
                  <div className="flex justify-center gap-4 mt-2">
                    <button
                      onClick={() => handleMealChoice("yes")}
                      className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => handleMealChoice("no")}
                      className="px-4 py-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500"
                    >
                      No
                    </button>
                  </div>
                </>
              )}

              {showMealFetchButton && (
                <div className="mt-4 text-left">
                  <p className="mb-2 font-medium">Generating your {userData.planLength ?? "7"}-day meal plan... 🍲</p>
                  <button
                    onClick={fetchMealPlan}
                    className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"
                  >
                    Generate Meal Plan
                  </button>
                </div>
              )}

              {mealPlan.length > 0 && (
                <div className="mt-4 text-left space-y-2">
                  <h2 className="text-lg font-semibold">🍽️ Meal Plan:</h2>
                  {mealPlan.map((line: string, idx: number) => (
                    <p key={idx}><strong>Day {idx + 1}:</strong> {line}</p>
                  ))}
                </div>
              )}

              {showStartOver && (
                <div className="pt-6">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                  >
                    🔄 Start Over
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </main>
  )
}
