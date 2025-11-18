import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  createStudyRoom,
  joinStudyRoom,
  leaveStudyRoom,
  deleteStudyRoom,
  updateRoomPresence,
  subscribeToStudyRoom,
  subscribeToRoomParticipants,
  updateRoomTimer,
  getActiveStudyRooms,
  sendRoomChatMessage,
  subscribeToRoomChat,
  updateRoomNotes,
  addRoomTodo,
  toggleRoomTodo,
  deleteRoomTodo,
  subscribeToRoomTodos,
  backfillRoomTodosCreators,
  updateRoomPlaylist,
  updateRoomBackground,
  signalRoomPlayback,
  addRoomFileMetadata,
  subscribeToRoomFiles,
  deleteRoomFile,
  setRoomPresenceStatus,
} from '../utils/firestoreUtils';

const StudyRoomContext = createContext(null);

export const StudyRoomProvider = ({ children }) => {
  const { user, userProfile } = useAuth();
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [activeRooms, setActiveRooms] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [roomTodos, setRoomTodos] = useState([]);
  const [roomFiles, setRoomFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const INACTIVITY_MS = 60 * 60 * 1000;

  useEffect(() => {
    const unsubscribe = getActiveStudyRooms((rooms) => {
      console.log("Active rooms updated:", rooms);
      setActiveRooms(rooms);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentRoom) {
      setRoomData(null);
      setParticipants([]);
      setChatMessages([]);
      setRoomTodos([]);
      return;
    }

    const unsubscribeRoom = subscribeToStudyRoom(currentRoom, (data) => {
      setRoomData(data);
    });

    const unsubscribeParticipants = subscribeToRoomParticipants(currentRoom, (parts) => {
      setParticipants(parts);
    });

    const unsubscribeChat = subscribeToRoomChat(currentRoom, (messages) => {
      setChatMessages(messages);
    });

    const unsubscribeTodos = subscribeToRoomTodos(currentRoom, (todos) => {
      setRoomTodos(todos);
    });

    const unsubscribeFiles = subscribeToRoomFiles(currentRoom, (files) => {
      setRoomFiles(files);
    });

    return () => {
      unsubscribeRoom();
      unsubscribeParticipants();
      unsubscribeChat();
      unsubscribeTodos();
      unsubscribeFiles();
    };
  }, [currentRoom]);

  useEffect(() => {
    if (!currentRoom || !user) return;

    const interval = setInterval(() => {
      updateRoomPresence(currentRoom, user.uid).catch(console.error);
    }, 30000);

    return () => clearInterval(interval);
  }, [currentRoom, user]);

  useEffect(() => {
    if (!currentRoom || !user) return;
    const goInactive = () => {
      setRoomPresenceStatus(currentRoom, user.uid, 'inactive').catch(() => {});
    };
    const goActive = () => {
      setRoomPresenceStatus(currentRoom, user.uid, 'active').catch(() => {});
    };
    const onVisibility = () => (document.hidden ? goInactive() : goActive());
    const onBlur = () => goInactive();
    const onFocus = () => goActive();

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    window.addEventListener('beforeunload', onBlur);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('beforeunload', onBlur);
    };
  }, [currentRoom, user]);

  useEffect(() => {
    if (!currentRoom) return;
    const checkAndCloseIfInactive = async () => {
      try {

        const updatedAtMs = roomData?.updatedAt?.toMillis?.() || 0;
        const maxPresenceMs = (participants || []).reduce((max, p) => {
          const t = p?.lastActive?.toMillis?.() || 0;
          return t > max ? t : max;
        }, 0);
        const lastActivityMs = Math.max(updatedAtMs, maxPresenceMs);
        if (lastActivityMs === 0) return;
        const now = Date.now();
        const idle = now - lastActivityMs;
        if (idle > INACTIVITY_MS && roomData?.active !== false) {

          await deleteStudyRoom(currentRoom);
        }
      } catch (e) {
        console.warn('Inactivity check failed', e);
      }
    };

    checkAndCloseIfInactive();
    const timer = setInterval(checkAndCloseIfInactive, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [currentRoom, roomData, participants]);
  const createRoom = useCallback(async (roomConfig) => {
    if (!user) throw new Error('Must be logged in to create a room');
    
    setLoading(true);
    try {
      const roomData = {
        name: roomConfig.name,
        description: roomConfig.description || '',
        type: roomConfig.type || 'study',
        maxParticipants: roomConfig.maxParticipants || 50,
        isPrivate: roomConfig.isPrivate || false,
        password: roomConfig.password || null,
        creatorId: user.uid,
        creatorName: user.displayName || 'User',
        timer: {
          duration: roomConfig.timerDuration || 25 * 60, // 25 minutes in seconds
          remaining: roomConfig.timerDuration || 25 * 60,
          isRunning: false,
          startedAt: null,
        },
      };
      console.log("Creating room with data:", roomData);
      const roomId = await createStudyRoom(roomData);
      console.log("Room created with ID:", roomId);

      await joinRoom(roomId);
      return roomId;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const joinRoom = useCallback(async (roomId, password = null) => {
    if (!user) throw new Error('Must be logged in to join a room');
    
    setLoading(true);
    try {

      if (currentRoom) {
        await leaveStudyRoom(currentRoom, user.uid);
      }

      await joinStudyRoom(roomId, {
        userId: user.uid,
        displayName: user.displayName || 'User',
        photoURL: user.photoURL || null,
      });

      setCurrentRoom(roomId);
    } finally {
      setLoading(false);
    }
  }, [user, currentRoom]);

  const leaveRoom = useCallback(async () => {
    if (!currentRoom || !user) return;
    
    setLoading(true);
    try {
      await leaveStudyRoom(currentRoom, user.uid);
      setCurrentRoom(null);
      setRoomData(null);
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  }, [currentRoom, user]);

  const updateTimer = useCallback(async (timerData) => {
    if (!currentRoom) return;
    await updateRoomTimer(currentRoom, timerData);
  }, [currentRoom]);

  const startTimer = useCallback(async () => {
    if (!currentRoom || !roomData?.timer) return;
    await updateTimer({
      ...roomData.timer,
      isRunning: true,
      startedAt: Date.now(),
    });
  }, [currentRoom, roomData, updateTimer]);

  const pauseTimer = useCallback(async () => {
    if (!currentRoom || !roomData?.timer) return;
    
    const elapsed = roomData.timer.startedAt 
      ? Math.floor((Date.now() - roomData.timer.startedAt) / 1000)
      : 0;
    
    await updateTimer({
      ...roomData.timer,
      isRunning: false,
      remaining: Math.max(0, roomData.timer.remaining - elapsed),
      startedAt: null,
    });
  }, [currentRoom, roomData, updateTimer]);

  const resetTimer = useCallback(async (duration) => {
    if (!currentRoom) return;
    await updateTimer({
      duration: duration || 25 * 60,
      remaining: duration || 25 * 60,
      isRunning: false,
      startedAt: null,
    });
  }, [currentRoom, updateTimer]);

  const deleteRoom = useCallback(async () => {
    if (!currentRoom || !user) return;

    if (roomData?.creatorId !== user.uid) {
      throw new Error('Only the room creator can delete the room');
    }
    
    setLoading(true);
    try {
      await deleteStudyRoom(currentRoom);
      setCurrentRoom(null);
    } finally {
      setLoading(false);
    }
  }, [currentRoom, user, roomData]);

  const sendMessage = useCallback(async (message) => {
    if (!currentRoom || !user || !message.trim()) return;
    await sendRoomChatMessage(currentRoom, user.uid, user.displayName || 'User', message);
  }, [currentRoom, user]);

  const updateNotes = useCallback(async (notes) => {
    if (!currentRoom) return;
    const display = (user?.displayName || userProfile?.displayName || 'User');
    await updateRoomNotes(currentRoom, notes, user?.uid || null, display);
  }, [currentRoom, user, userProfile]);

  const updatePlaylist = useCallback(async (spotifyUrl) => {
    if (!currentRoom) return;
    const display = (user?.displayName || userProfile?.displayName || 'User');
    await updateRoomPlaylist(currentRoom, spotifyUrl, user?.uid || null, display);
  }, [currentRoom, user, userProfile]);

  const updateBackground = useCallback(async (backgroundUrl) => {
    if (!currentRoom) return;
    const display = (user?.displayName || userProfile?.displayName || 'User');
    await updateRoomBackground(currentRoom, backgroundUrl, user?.uid || null, display);
  }, [currentRoom, user, userProfile]);

  const signalPlayback = useCallback(async (action) => {
    if (!currentRoom) return;
    const display = (user?.displayName || userProfile?.displayName || 'User');
    await signalRoomPlayback(currentRoom, action, user?.uid || null, display);
  }, [currentRoom, user, userProfile]);

  const addRoomFile = useCallback(async (fileMeta) => {
    if (!currentRoom) return;
    await addRoomFileMetadata(currentRoom, fileMeta);
  }, [currentRoom]);

  const removeRoomFile = useCallback(async (fileId) => {
    if (!currentRoom) return;
    await deleteRoomFile(currentRoom, fileId);
  }, [currentRoom]);

  const addTodo = useCallback(async (todoText) => {
    if (!currentRoom || !todoText.trim() || !user) return;
    const display = (user.displayName || userProfile?.displayName || 'User');
    const photo = (user.photoURL || userProfile?.photoURL || null);
    await addRoomTodo(currentRoom, todoText, user.uid, display, photo);
  }, [currentRoom, user, userProfile]);

  const toggleTodo = useCallback(async (todoId, completed) => {
    if (!currentRoom) return;
    await toggleRoomTodo(currentRoom, todoId, completed);
  }, [currentRoom]);

  const deleteTodo = useCallback(async (todoId) => {
    if (!currentRoom) return;
    await deleteRoomTodo(currentRoom, todoId);
  }, [currentRoom]);

  const fixUnknownTodoCreators = useCallback(async () => {
    if (!currentRoom || !user) return 0;
    const display = (user.displayName || userProfile?.displayName || 'User');
    const photo = (user.photoURL || userProfile?.photoURL || null);
    return backfillRoomTodosCreators(currentRoom, user.uid, display, photo);
  }, [currentRoom, user, userProfile]);

  const value = {
    currentRoom,
    roomData,
    participants,
    activeRooms,
    chatMessages,
    roomTodos,
    roomFiles,
    loading,
    createRoom,
    joinRoom,
    leaveRoom,
    deleteRoom,
    sendMessage,
    updateNotes,
    updatePlaylist,
    updateBackground,
    signalPlayback,
    addRoomFile,
    removeRoomFile,
    addTodo,
    toggleTodo,
    deleteTodo,
    fixUnknownTodoCreators,
    startTimer,
    pauseTimer,
    resetTimer,
    updateTimer,
  };

  return (
    <StudyRoomContext.Provider value={value}>
      {children}
    </StudyRoomContext.Provider>
  );
};

export const useStudyRoom = () => {
  const context = useContext(StudyRoomContext);
  if (!context) {
    throw new Error('useStudyRoom must be used within StudyRoomProvider');
  }
  return context;
};