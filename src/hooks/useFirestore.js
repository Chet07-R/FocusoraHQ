import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  subscribeToUserProfile,
  updateUserProfile,
  subscribeToNotes,
  subscribeToTodos,
  saveNote,
  updateNote,
  deleteNote,
  saveTodo,
  updateTodo,
  deleteTodo,
} from '../utils/firestoreUtils';

/**
 * Hook to manage user profile with real-time updates
 */
export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToUserProfile(user.uid, (profileData) => {
      setProfile(profileData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateProfile = async (updates) => {
    if (!user) return;
    await updateUserProfile(user.uid, updates);
  };

  return { profile, loading, updateProfile };
};

/**
 * Hook to manage user notes with real-time sync
 */
export const useNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToNotes(user.uid, (notesData) => {
      setNotes(notesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addNote = async (noteData) => {
    if (!user) return;
    return await saveNote(user.uid, noteData);
  };

  const editNote = async (noteId, updates) => {
    if (!user) return;
    await updateNote(user.uid, noteId, updates);
  };

  const removeNote = async (noteId) => {
    if (!user) return;
    await deleteNote(user.uid, noteId);
  };

  return { notes, loading, addNote, editNote, removeNote };
};

/**
 * Hook to manage user todos with real-time sync
 */
export const useTodos = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTodos([]);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToTodos(user.uid, (todosData) => {
      setTodos(todosData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTodo = async (todoData) => {
    if (!user) return;
    return await saveTodo(user.uid, todoData);
  };

  const editTodo = async (todoId, updates) => {
    if (!user) return;
    await updateTodo(user.uid, todoId, updates);
  };

  const removeTodo = async (todoId) => {
    if (!user) return;
    await deleteTodo(user.uid, todoId);
  };

  const toggleTodo = async (todoId, completed) => {
    if (!user) return;
    await updateTodo
    (user.uid, todoId, { completed });
  };

  return { todos, loading, addTodo, editTodo, removeTodo, toggleTodo };
};
