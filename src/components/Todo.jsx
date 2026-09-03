import React, { useEffect, useState } from "react";
import { PlusCircle, Trash2, CheckCircle } from "lucide-react";
import { useStudyRoom } from "../context/StudyRoomContext";
import { useAuth } from "../context/AuthContext";

const Todo = ({
  addNotification = () => { },
  onTaskAdded = () => { },
  onTaskCompleted = () => { },
  scope = "auto",
}) => {
  const { currentRoom, roomTodos, participants, addTodo, toggleTodo, deleteTodo, fixUnknownTodoCreators } = useStudyRoom();
  const { user, userProfile } = useAuth();
  const prevTodosRef = React.useRef(null);
  const initializedRef = React.useRef(false);
  const [newTask, setNewTask] = useState("");
  const todosStorageKey = scope === "room" ? "sr_todos" : "myspace_todos";
  const [localTodos, setLocalTodos] = useState([]);

  const isRoomMode = scope === "room" ? Boolean(currentRoom) : scope === "personal" ? false : Boolean(currentRoom);
  const todos = isRoomMode ? (roomTodos || []) : localTodos;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(todosStorageKey);
      setLocalTodos(saved ? JSON.parse(saved) : []);
    } catch {
      setLocalTodos([]);
    }
  }, [todosStorageKey]);

  useEffect(() => {
    if (!isRoomMode) {
      localStorage.setItem(todosStorageKey, JSON.stringify(localTodos));
    }
  }, [localTodos, isRoomMode, todosStorageKey]);

  const addTask = async () => {
    const t = newTask.trim();
    if (!t) return addNotification("⚠️ Enter a task first");

    if (isRoomMode) {

      try {
        await addTodo(t);
        setNewTask("");
        addNotification("✅ Task added");
        await onTaskAdded();
      } catch (e) {
        addNotification("❌ Failed to add task");
        console.error(e);
      }
    } else {

      const newTodo = {
        id: Date.now().toString(),
        text: t,
        completed: false,
        createdById: user?.uid || 'local',
        createdByName: user?.displayName || userProfile?.displayName || 'You',
        createdAt: new Date().toISOString()
      };
      setLocalTodos(prev => [...prev, newTodo]);
      setNewTask("");
      addNotification("✅ Task added");
      await onTaskAdded();
    }
  };

  const toggleTask = async (todo) => {
    if (isRoomMode) {
      try {
        await toggleTodo(todo.id, !todo.completed);
        if (!todo.completed) {
          await onTaskCompleted();
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setLocalTodos(prev => prev.map(t =>
        t.id === todo.id ? { ...t, completed: !t.completed } : t
      ));
      if (!todo.completed) {
        await onTaskCompleted();
      }
    }
  };

  const removeTask = async (todo) => {
    if (isRoomMode) {
      try {
        await deleteTodo(todo.id);
        addNotification("🗑️ Task removed");
      } catch (e) {
        addNotification("❌ Failed to remove task");
        console.error(e);
      }
    } else {
      setLocalTodos(prev => prev.filter(t => t.id !== todo.id));
      addNotification("🗑️ Task removed");
    }
  };

  const active = todos.filter((t) => !t.completed).length;
  const hasUnknown = isRoomMode && (roomTodos || []).some(t => !t.createdById || !t.createdByName);

  useEffect(() => {
    if (!isRoomMode) {
      prevTodosRef.current = null;
      initializedRef.current = false;
      return;
    }

    const prev = prevTodosRef.current || [];
    const prevMap = new Map(prev.map(t => [t.id, t]));
    const curr = roomTodos || [];
    const currMap = new Map(curr.map(t => [t.id, t]));

    if (!initializedRef.current) {
      initializedRef.current = true;
      prevTodosRef.current = curr;
      return;
    }


    curr.forEach(t => {
      if (!prevMap.has(t.id)) {
        const own = t.createdById && user && t.createdById === user.uid;
        if (!own) addNotification(`➕ Task added by ${t.createdByName || 'Someone'}: ${t.text}`);
      }
    });

    curr.forEach(t => {
      const p = prevMap.get(t.id);
      if (p && p.completed !== t.completed) {
        const state = t.completed ? 'completed' : 'reopened';
        addNotification(`☑️ Task ${state}: ${t.text}`);
      }
    });

    prev.forEach(p => {
      if (!currMap.has(p.id)) {
        addNotification(`🗑️ Task removed: ${p.text}`);
      }
    });
    prevTodosRef.current = curr;
  }, [roomTodos, user, isRoomMode]);

  return (
    <section
      className="bg-white/70 dark:bg-white/10 border border-slate-200/50 dark:border-white/10 rounded-xl p-3 sm:p-4 shadow-lg overflow-hidden relative z-10 pointer-events-auto text-slate-800 dark:text-white h-full flex flex-col flex-1 min-h-0"
      style={{ backdropFilter: "blur(10px)" }}
    >
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <CheckCircle className="text-emerald-400" />
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">To-Do List</h3>
        </div>
        <div className="flex items-center gap-3">
          {hasUnknown && (
            <button
              onClick={async () => {
                try {
                  const updated = await fixUnknownTodoCreators();
                  if (updated > 0) addNotification(`🔧 Fixed ${updated} item(s)`);
                  else addNotification('ℹ️ Nothing to fix');
                } catch {
                  addNotification('❌ Failed to fix');
                }
              }}
              className="text-[11px] text-gray-300 underline underline-offset-2 hover:text-white"
            >
              Fix unknown
            </button>
          )}
          <div className="text-xs sm:text-sm text-slate-500 dark:text-gray-300">{active} active</div>
        </div>
      </div>

      <div className="flex gap-2.5 mb-3 flex-shrink-0">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..."
          className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-100/50 dark:bg-white/10 text-slate-800 dark:text-white border border-slate-200/50 dark:border-white/10 outline-none cursor-text"
        />
        <button type="button" onClick={addTask} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs sm:text-sm font-semibold shadow-sm hover:opacity-95 transition cursor-pointer">
          <PlusCircle size={15} />
          <span className="select-none">Add</span>
        </button>
      </div>

      <ul className="flex-1 min-h-[120px] overflow-y-auto custom-scrollbar pr-1 space-y-2.5">
        <style>{`
          @keyframes bounceShort {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2) rotate(3deg); }
          }
          .animate-bounce-short {
            animation: bounceShort 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
        `}</style>
        {todos.map((t) => (
          <li key={t.id} className="flex items-center justify-between bg-slate-100/50 dark:bg-white/5 p-2.5 rounded-lg border border-slate-200/50 dark:border-transparent">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => toggleTask(t)}
                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-300 active:scale-90 flex-shrink-0 ${t.completed
                    ? "bg-emerald-500 border-emerald-500 text-white animate-bounce-short"
                    : "border-slate-300 dark:border-slate-600 hover:border-emerald-400"
                  }`}
                aria-label={t.completed ? "Mark task incomplete" : "Mark task complete"}
              >
                {t.completed && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <div className="flex flex-col min-w-0">
                <div className={t.completed ? "text-xs sm:text-sm line-through text-slate-400 dark:text-gray-400 transition-all duration-300 truncate" : "text-xs sm:text-sm text-slate-800 dark:text-white transition-all duration-300 truncate"}>{t.text}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              {(() => {
                const own = t.createdById && user && t.createdById === user.uid;
                const fromPresence = (participants || []).find(p => p.userId === t.createdById);
                const name = t.createdByName
                  || (fromPresence && fromPresence.displayName)
                  || (own && (user?.displayName || userProfile?.displayName || 'You'))
                  || 'Unknown';
                return (<span className="text-[10px] sm:text-[11px] text-gray-400 italic">{own && !t.createdByName ? 'You' : name}</span>);
              })()}
              <button type="button" onClick={() => removeTask(t)} className="text-red-400 hover:text-red-500 cursor-pointer p-0.5">
                <Trash2 size={15} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Todo;
