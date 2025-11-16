import React, { useEffect, useState } from "react";
import { PlusCircle, Trash2, CheckCircle } from "lucide-react";
import { useStudyRoom } from "../context/StudyRoomContext";
import { useAuth } from "../context/AuthContext";

const Todo = ({ addNotification = () => {} }) => {
  const { currentRoom, roomTodos, participants, addTodo, toggleTodo, deleteTodo, fixUnknownTodoCreators } = useStudyRoom();
  const { user, userProfile } = useAuth();
  const prevTodosRef = React.useRef(null);
  const initializedRef = React.useRef(false);
  const [newTask, setNewTask] = useState("");

  const addTask = async () => {
    const t = newTask.trim();
    if (!t) return addNotification("⚠️ Enter a task first");
    if (!currentRoom) return addNotification("❌ Join a room first");
    try {
      await addTodo(t);
      setNewTask("");
      addNotification("✅ Task added");
    } catch (e) {
      addNotification("❌ Failed to add task");
      console.error(e);
    }
  };

  const toggleTask = async (todo) => {
    if (!currentRoom) return;
    try {
      await toggleTodo(todo.id, !todo.completed);
    } catch (e) {
      console.error(e);
    }
  };

  const removeTask = async (todo) => {
    if (!currentRoom) return;
    try {
      await deleteTodo(todo.id);
      addNotification("🗑️ Task removed");
    } catch (e) {
      addNotification("❌ Failed to remove task");
      console.error(e);
    }
  };

  const active = (roomTodos || []).filter((t) => !t.completed).length;
  const hasUnknown = (roomTodos || []).some(t => !t.createdById || !t.createdByName);

  // Real-time notifications for todo changes
  useEffect(() => {
    const prev = prevTodosRef.current || [];
    const prevMap = new Map(prev.map(t => [t.id, t]));
    const curr = roomTodos || [];
    const currMap = new Map(curr.map(t => [t.id, t]));

    if (!initializedRef.current) {
      initializedRef.current = true;
      prevTodosRef.current = curr;
      return;
    }

    // Added
    curr.forEach(t => {
      if (!prevMap.has(t.id)) {
        const own = t.createdById && user && t.createdById === user.uid;
        if (!own) addNotification(`➕ Task added by ${t.createdByName || 'Someone'}: ${t.text}`);
      }
    });
    // Toggled
    curr.forEach(t => {
      const p = prevMap.get(t.id);
      if (p && p.completed !== t.completed) {
        const state = t.completed ? 'completed' : 'reopened';
        addNotification(`☑️ Task ${state}: ${t.text}`);
      }
    });
    // Deleted
    prev.forEach(p => {
      if (!currMap.has(p.id)) {
        addNotification(`🗑️ Task removed: ${p.text}`);
      }
    });
    prevTodosRef.current = curr;
  }, [roomTodos, user]);

  return (
    <section className="glass-card rounded-xl p-6 shadow-lg overflow-hidden" style={{ backdropFilter: "blur(10px)" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">To-Do List</h3>
        </div>
        <div className="flex items-center gap-3">
          {hasUnknown && currentRoom && (
            <button
              onClick={async () => {
                try {
                  const updated = await fixUnknownTodoCreators();
                  if (updated > 0) addNotification(`🔧 Fixed ${updated} item(s)`);
                  else addNotification('ℹ️ Nothing to fix');
                } catch (e) {
                  addNotification('❌ Failed to fix');
                }
              }}
              className="text-[11px] text-gray-300 underline underline-offset-2 hover:text-white"
            >
              Fix unknown
            </button>
          )}
          <div className="text-sm text-gray-300">{active} active</div>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder={currentRoom ? "Add a new task..." : "Join a room to add tasks"}
          disabled={!currentRoom}
          className="flex-1 px-3 py-2 rounded-md bg-white/10 text-white outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button onClick={addTask} disabled={!currentRoom} className="flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:opacity-95 transition disabled:opacity-50 disabled:cursor-not-allowed">
          <PlusCircle size={16} />
          <span className="select-none">Add</span>
        </button>
      </div>

      <ul className="space-y-3 max-h-[450px] overflow-auto custom-scrollbar pr-2">
        <div className="space-y-3 h-[450px] overflow-y-auto">
          {(roomTodos || []).map((t) => (
            <li key={t.id} className="flex items-center justify-between bg-white/5 p-3 rounded-md">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={!!t.completed} onChange={() => toggleTask(t)} className="w-4 h-4" />
                <div className="flex flex-col">
                  <div className={t.completed ? "text-sm line-through text-gray-400" : "text-sm text-white"}>{t.text}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {(() => {
                  const own = t.createdById && user && t.createdById === user.uid;
                  const fromPresence = (participants || []).find(p => p.userId === t.createdById);
                  const name = t.createdByName
                    || (fromPresence && fromPresence.displayName)
                    || (own && (user?.displayName || userProfile?.displayName || 'You'))
                    || 'Unknown';
                  return (<span className="text-[11px] text-gray-400 italic">{own && !t.createdByName ? 'You' : name}</span>);
                })()}
                <button onClick={() => removeTask(t)} className="text-red-400">
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </div>
      </ul>
    </section>
  );
};

export default Todo;
