"use client"

import { useState } from "react"
import UserForm from "./components/UserForm"

// Define the shape of user data explicitly
interface UserData {
  name: string
  height: number | string
  weight: number | string
  goal: string
  limitations?: string
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [motivation, setMotivation] = useState("")
  const [activity, setActivity] = useState("")
  const [weeklyPlan, setWeeklyPlan] = useState("")
  const [loading, setLoading] = useState(false)
  const [showMealQuestion, setShowMealQuestion] = useState(false)
  const [mealPlan, setMealPlan] = useState("")
  const [showStartOver, setShowStartOver] = useState(false)

  // Use UserData instead of any for the data param
  const handleUserSubmit = async (data: UserData) => {
    setUserData(data)
    setLoading(true)
    setMotivation("")
    setActivity("")
    setWeeklyPlan("")
    setMealPlan("")
    setShowMealQuestion(false)
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

  const handleMealChoice = async (choice: "yes" | "no") => {
    setShowMealQuestion(false)
    if (choice === "no") {
      setShowStartOver(true)
      return
    }

    try {
      const res = await fetch("/api/mealprep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      })

      const result = await res.json()
      setMealPlan(result.mealPlan)
    } catch (error) {
      console.error("Error fetching meal plan:", error)
      setMealPlan("⚠️ Could not load meal plan.")
    } finally {
      setShowStartOver(true)
    }
  }

  const handleReset = () => {
    setUserData(null)
    setMotivation("")
    setActivity("")
    setWeeklyPlan("")
    setMealPlan("")
    setShowMealQuestion(false)
    setShowStartOver(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-fuchsia-200 flex items-center justify-center p-4">
      {!userData ? (
        <UserForm onSubmit={handleUserSubmit} />
      ) : (
        <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-4 text-center">
          <h1 className="text-3xl font-bold">Welcome, {userData.name}!</h1>
          <p className="text-lg">🎯 Goal: {userData.goal.replace("_", " ")}</p>
          <p>📏 Height: {userData.height}</p>
          <p>⚖️ Weight: {userData.weight}</p>
          <p>🩺 Limitations: {userData.limitations || "None"}</p>

          {loading ? (
            <p className="mt-4 text-indigo-600 font-medium">⏳ Generating your MissionFit plan...</p>
          ) : (
            <>
              <div className="text-left space-y-2">
                <p><strong>💡 Recommended Activity:</strong> {activity}</p>
                <p><strong>📅 Weekly Workout Plan:</strong><br />{weeklyPlan}</p>
                <p className="text-indigo-700 font-semibold">{motivation}</p>
              </div>

              {showMealQuestion && (
                <>
                  <p className="mt-4 font-medium">Would you like a meal plan suggestion for the week? 🍽️</p>
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

              {mealPlan && (
                <div className="mt-4 text-left space-y-2">
                  <h2 className="text-lg font-semibold">🍽️ Meal Plan:</h2>
                  <p>{mealPlan}</p>
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
