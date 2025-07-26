"use client"

import { useEffect, useState } from "react"

interface Task {
  id: string
  title: string
  completed: boolean
  parentId?: string   
}

export default function ToDoList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [loading, setLoading] = useState(false)
  const [newSubtaskParent, setNewSubtaskParent] = useState<string | null>(null)
  const [subtaskTitle, setSubtaskTitle] = useState("")    

  // Load tasks on first render
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/tasks")
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      console.error("Failed to load tasks:", err)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (!newTask.trim()) return

    const task: Partial<Task> = {
      title: newTask,
      completed: false,
    }

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      })
      const added = await res.json()
      setTasks([...tasks, added])
      setNewTask("")
    } catch (err) {
      console.error("Error adding task:", err)
    }
  }

    const addSubtask = async (parentId: string, subtaskTitle: string) => {
    if (!subtaskTitle.trim()) return;

    const subtask: Partial<Task> = {
      title: subtaskTitle,
      completed: false,
      parentId,
    };

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subtask),
      });
      const added = await res.json();
      setTasks([...tasks, added]);
    } catch (err) {
      console.error("Error adding subtask:", err);
    }
  }  
  const updateTask = async (updatedTask: Task) => {
    try {
      await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      })
      setTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)))
    } catch (err) {
      console.error("Error updating task:", err)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await fetch(`/api/tasks`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      setTasks(tasks.filter(t => t.id !== id))
    } catch (err) {
      console.error("Error deleting task:", err)
    }
  }
    const renderTaskItem = (task: Task) => (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                        updateTask({ ...task, completed: !task.completed })
                    }
                />
                <span
                    className={`${
                        task.completed ? "line-through text-gray-500" : "text-gray-900"
                    }`}
                >
                    {task.title}
                </span>
            </div>
            <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
            >
                Delete
            </button>
        </div>
    )
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">📝 Your Task List</h2>
      <div className="flex gap-2">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow p-2 border rounded-lg"
        />
        <button
          onClick={addTask}
          className="bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-indigo-900"
        >
          Add
        </button>
      </div>

      {loading ? (
        <p className="text-center text-indigo-600">Loading tasks...</p>
      ) : (
        <ul className="space-y-2">
            {tasks
                .filter((task) => !task.parentId)
                .map((task) => (
                    <li key={task.id} className="space-y-2">
                        {renderTaskItem(task)}

                        {/* Subtasks */}
                        <ul className="ml-6 mt-1 space-y-1">
                            {tasks
                                .filter((sub) => sub.parentId === task.id)
                                .map((sub) => (
                                    <li key={sub.id} className="ml-4">
                                        {renderTaskItem(sub)}
                                    </li>
                                ))}
                        </ul>

                        {/* Add Subtask */}
                        <div className="mt-2 ml-6">
                            <button
                                onClick={() => setNewSubtaskParent(task.id)}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                ➕ Add Subtask
                            </button>
                            {newSubtaskParent === task.id && (
                                <div className="flex mt-2 gap-2">
                                    <input
                                        value={subtaskTitle}
                                        onChange={(e) => setSubtaskTitle(e.target.value)}
                                        placeholder="Subtask title"
                                        className="flex-grow p-1 border rounded"
                                    />
                                    <button
                                        onClick={() => {
                                            addSubtask(task.id, subtaskTitle);
                                            setSubtaskTitle("");
                                            setNewSubtaskParent(null);
                                        }}
                                        className="bg-indigo-700 text-white px-2 rounded hover:bg-indigo-800"
                                    >
                                        Add
                                    </button>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
        </ul>
      )}
        </div>
  )  
 
}
