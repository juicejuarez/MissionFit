"use client"

import ToDoList from "../components/ToDoList"

export default function TaskPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-fuchsia-200 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-900">
          📝 Your MissionFit Task Manager
        </h1>
        <ToDoList />
      </div>
    </main>
  )
}
