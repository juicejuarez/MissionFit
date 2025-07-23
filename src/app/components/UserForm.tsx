"use client"

import { useState } from "react"

// Define the same UserData interface as in page.tsx
interface UserData {
  name: string
  weight: string // Using string here because inputs return strings
  height: string
  goal: string
  limitations: string
}

export default function UserForm({ onSubmit }: { onSubmit: (data: UserData) => void }) {
  const [formData, setFormData] = useState<UserData>({
    name: "",
    weight: "",
    height: "",
    goal: "",
    limitations: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-4">
      <h2 className="text-2xl font-bold text-center">Welcome to MissionFit 💪</h2>

      <input
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
        required
      />

      <input
        name="weight"
        type="number"
        placeholder="Weight (lbs or kg)"
        value={formData.weight}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
        required
      />

      <input
        name="height"
        type="number"
        placeholder="Height (in or cm)"
        value={formData.height}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
        required
      />

      <select
        name="goal"
        value={formData.goal}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
        required
      >
        <option value="">Select a Goal</option>
        <option value="lose_weight">Lose Weight</option>
        <option value="gain_muscle">Gain Muscle</option>
        <option value="increase_stamina">Increase Stamina</option>
        <option value="move_better">Move with Limitations</option>
      </select>

      <textarea
        name="limitations"
        placeholder="e.g., knee injury, asthma, post-surgery recovery, wheelchair use"
        value={formData.limitations}
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
        rows={3}
      />

      <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">
        Start My Mission 🚀
      </button>
    </form>
  )
}
