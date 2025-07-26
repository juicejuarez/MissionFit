import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

interface Task {
  id: string
  title: string
  completed: boolean
  parentId?: string // Optional for subtasks
}

const filePath = path.join(process.cwd(), "src", "data", "tasks.json")

// Helper: Load existing tasks
async function readTasks() {
  try {
    const data = await fs.readFile(filePath, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

// Helper: Save updated tasks
async function writeTasks(tasks: Task[]) {
  await fs.writeFile(filePath, JSON.stringify(tasks, null, 2))
}

// GET /api/tasks
export async function GET() {
  const tasks = await readTasks()
  return NextResponse.json(tasks)
}

// POST /api/tasks
export async function POST(req: Request) {
  const newTask = await req.json()
  const tasks = await readTasks()

  const taskWithId = { id: uuidv4(), ...newTask }
  tasks.push(taskWithId)

  await writeTasks(tasks)
  return NextResponse.json(taskWithId)
}

// PUT /api/tasks
export async function PUT(req: Request) {
  const updated = await req.json()
  const tasks = await readTasks()

  const index = tasks.findIndex((t: Task) => t.id === updated.id)

  if (index === -1) return NextResponse.json({ error: "Task not found" }, { status: 404 })

  tasks[index] = updated
  await writeTasks(tasks)
  return NextResponse.json(updated)
}

// DELETE /api/tasks
export async function DELETE(req: Request) {
  const { id } = await req.json()
  let tasks = await readTasks()

  tasks = tasks.filter((t: Task) => t.id !== id)

  await writeTasks(tasks)

  return NextResponse.json({ success: true })
}
