import React, { useEffect, useState } from "react";
import { PlusCircle, Trash2, CheckCircle } from "lucide-react";

const Todo = ({ addNotification = () => {} }) => {
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem("sr_tasks");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("sr_tasks", JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  const addTask = () => {
    const t = newTask.trim();
    if (!t) return addNotification("⚠️ Enter a task first");
    setTasks((s) => [...s, { text: t, completed: false }]);
    setNewTask("");
    addNotification("✅ Task added");
  };

  const toggleTask = (i) => {
    setTasks((s) => s.map((t, idx) => (idx === i ? { ...t, completed: !t.completed } : t)));
  };

  const removeTask = (i) => {
    setTasks((s) => s.filter((_, idx) => idx !== i));
    addNotification("🗑️ Task removed");
  };

  const active = tasks.filter((t) => !t.completed).length;

  return (
    <section className="glass-card rounded-xl p-6 shadow-lg overflow-hidden" style={{ backdropFilter: "blur(10px)" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">To-Do List</h3>
        </div>
        <div className="text-sm text-gray-300">{active} active</div>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-3 py-2 rounded-md bg-white/10 text-white outline-none"
        />
        <button onClick={addTask} className="flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:opacity-95 transition">
          <PlusCircle size={16} />
          <span className="select-none">Add</span>
        </button>
      </div>

      <ul className="space-y-3 max-h-[450px] overflow-auto custom-scrollbar pr-2">
        <div className="space-y-3 h-[450px] overflow-y-auto">
          {tasks.map((t, i) => (
          <li key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-md">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={t.completed} onChange={() => toggleTask(i)} className="w-4 h-4" />
              <div className={t.completed ? "text-sm line-through text-gray-400" : "text-sm text-white"}>{t.text}</div>
            </div>
            <button onClick={() => removeTask(i)} className="text-red-400">
              <Trash2 size={16} />
            </button>
          </li>
          ))}
        </div>
      </ul>
    </section>
  );
};

export default Todo;
