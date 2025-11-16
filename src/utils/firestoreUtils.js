import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  getDocs,
  writeBatch,
  collectionGroup,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

// ==================== USER PROFILES ====================

/**
 * Create or update user profile in Firestore
 */
export const createUserProfile = async (userId, profileData) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...profileData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    totalStudyTime: 0,
    studySessions: 0,
    streak: 0,
    points: 0,
  }, { merge: true });
};

/**
 * Get user profile
 */
export const getUserProfile = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updates) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Subscribe to user profile changes (real-time)
 */
export const subscribeToUserProfile = (userId, callback) => {
  const userRef = doc(db, 'users', userId);
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    }
  });
};

// ==================== STUDY SESSIONS ====================

/**
 * Create a new study session
 */
export const createStudySession = async (userId, sessionData) => {
  const sessionRef = doc(collection(db, 'studySessions'));
  await setDoc(sessionRef, {
    userId,
    ...sessionData,
    startTime: serverTimestamp(),
    endTime: null,
    duration: 0,
    active: true,
    createdAt: serverTimestamp(),
  });
  return sessionRef.id;
};

/**
 * End a study session and update user stats
 */
export const endStudySession = async (sessionId, userId, durationMinutes) => {
  const sessionRef = doc(db, 'studySessions', sessionId);
  const userRef = doc(db, 'users', userId);

  // Update session
  await updateDoc(sessionRef, {
    endTime: serverTimestamp(),
    duration: durationMinutes,
    active: false,
  });

  // Update user stats
  await updateDoc(userRef, {
    totalStudyTime: increment(durationMinutes),
    studySessions: increment(1),
    points: increment(Math.floor(durationMinutes / 5)), // 1 point per 5 mins
    updatedAt: serverTimestamp(),
  });
};

/**
 * Get user's study history
 */
export const getUserStudySessions = (userId, callback, limitCount = 20) => {
  const q = query(
    collection(db, 'studySessions'),
    where('userId', '==', userId),
    orderBy('startTime', 'desc'),
    limit(limitCount)
  );
  return onSnapshot(q, (snapshot) => {
    const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(sessions);
  });
};

// ==================== STUDY ROOMS ====================

/**
 * Create a study room
 */
export const createStudyRoom = async (roomData) => {
  // Generate custom id like SR-A7F (random 3-char alphanumeric) with retries to avoid collisions
  const makeId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no confusing O/0/I/1
    let code = '';
    for (let i = 0; i < 3; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return `SR-${code}`;
  };
  let id = makeId();
  let attempts = 0;
  while (attempts < 20) {
    const candidateRef = doc(db, 'studyRooms', id);
    const existing = await getDoc(candidateRef);
    if (!existing.exists()) {
      // Use this id
      await setDoc(candidateRef, {
        ...roomData,
        participants: [],
        participantCount: 0,
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return id;
    }
    attempts += 1;
    id = makeId();
  }
  // Fallback to Firestore auto-id if repeated collisions (extremely unlikely)
  const autoRef = doc(collection(db, 'studyRooms'));
  await setDoc(autoRef, {
    ...roomData,
    participants: [],
    participantCount: 0,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return autoRef.id;
};

/**
 * Join a study room
 */
export const joinStudyRoom = async (roomId, userData) => {
  const roomRef = doc(db, 'studyRooms', roomId);
  const presenceRef = doc(db, 'studyRooms', roomId, 'presence', userData.userId);

  // Add to participants array
  await updateDoc(roomRef, {
    participants: arrayUnion(userData.userId),
    participantCount: increment(1),
    updatedAt: serverTimestamp(),
  });

  // Set presence document
  await setDoc(presenceRef, {
    userId: userData.userId,
    displayName: userData.displayName,
    photoURL: userData.photoURL || null,
    joinedAt: serverTimestamp(),
    lastActive: serverTimestamp(),
    status: 'active',
  });
};

/**
 * Leave a study room
 */
export const leaveStudyRoom = async (roomId, userId) => {
  const roomRef = doc(db, 'studyRooms', roomId);
  const presenceRef = doc(db, 'studyRooms', roomId, 'presence', userId);

  // Remove from participants
  await updateDoc(roomRef, {
    participants: arrayRemove(userId),
    participantCount: increment(-1),
    updatedAt: serverTimestamp(),
  });

  // Delete presence
  await deleteDoc(presenceRef);
};

/**
 * Update user presence in study room (heartbeat)
 */
export const updateRoomPresence = async (roomId, userId) => {
  const presenceRef = doc(db, 'studyRooms', roomId, 'presence', userId);
  await updateDoc(presenceRef, {
    lastActive: serverTimestamp(),
    status: 'active',
  });
};

/**
 * Update presence status explicitly (e.g., 'active' | 'inactive' | 'away')
 */
export const setRoomPresenceStatus = async (roomId, userId, status) => {
  const presenceRef = doc(db, 'studyRooms', roomId, 'presence', userId);
  const update = { status };
  if (status === 'active') update.lastActive = serverTimestamp();
  await updateDoc(presenceRef, update);
};

/**
 * Delete/close a study room (only creator can do this)
 */
export const deleteStudyRoom = async (roomId) => {
  const roomRef = doc(db, 'studyRooms', roomId);
  
  // Set room to inactive and clear participants
  await updateDoc(roomRef, {
    active: false,
    participants: [],
    participantCount: 0,
    closedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/**
 * Subscribe to study room updates (real-time)
 */
export const subscribeToStudyRoom = (roomId, callback) => {
  const roomRef = doc(db, 'studyRooms', roomId);
  return onSnapshot(roomRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    }
  });
};

/**
 * Subscribe to study room participants (real-time)
 */
export const subscribeToRoomParticipants = (roomId, callback) => {
  const presenceCollection = collection(db, 'studyRooms', roomId, 'presence');
  return onSnapshot(presenceCollection, (snapshot) => {
    const participants = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(participants);
  });
};

/**
 * Update study room timer (shared timer)
 */
export const updateRoomTimer = async (roomId, timerData) => {
  const roomRef = doc(db, 'studyRooms', roomId);
  await updateDoc(roomRef, {
    timer: timerData,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Get all active study rooms
 */
export const getActiveStudyRooms = (callback) => {
  const q = query(
    collection(db, 'studyRooms'),
    where('active', '==', true),
    limit(50)
  );
  return onSnapshot(q, (snapshot) => {
    const rooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Firestore query returned rooms:", rooms);
    callback(rooms);
  }, (error) => {
    console.error("Error fetching active rooms:", error);
  });
};

// ==================== ROOM CHAT ====================

/**
 * Send a chat message to the room
 */
export const sendRoomChatMessage = async (roomId, userId, displayName, message) => {
  const messagesRef = collection(db, 'studyRooms', roomId, 'messages');
  await addDoc(messagesRef, {
    userId,
    displayName: displayName || 'User',
    message,
    timestamp: serverTimestamp(),
  });
};

/**
 * Subscribe to room chat messages (real-time)
 */
export const subscribeToRoomChat = (roomId, callback) => {
  const messagesRef = collection(db, 'studyRooms', roomId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(100));
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
};

// ==================== ROOM NOTES ====================

/**
 * Update room notes (shared by all participants)
 */
export const updateRoomNotes = async (roomId, notes, updatedById = null, updatedByName = null) => {
  const roomRef = doc(db, 'studyRooms', roomId);
  await updateDoc(roomRef, {
    sharedNotes: notes,
    notesUpdatedById: updatedById,
    notesUpdatedByName: updatedByName,
    updatedAt: serverTimestamp(),
  });
};

// ==================== ROOM TODOS ====================

/**
 * Add a todo to the room
 */
export const addRoomTodo = async (roomId, todoText, createdById, createdByName, createdByPhotoURL = null) => {
  const todosRef = collection(db, 'studyRooms', roomId, 'todos');
  await addDoc(todosRef, {
    text: todoText,
    completed: false,
    createdById: createdById || null,
    createdByName: createdByName || 'User',
    createdByPhotoURL: createdByPhotoURL || null,
    createdAt: serverTimestamp(),
  });
};

/**
 * Toggle todo completion status
 */
export const toggleRoomTodo = async (roomId, todoId, completed) => {
  const todoRef = doc(db, 'studyRooms', roomId, 'todos', todoId);
  await updateDoc(todoRef, {
    completed,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a room todo
 */
export const deleteRoomTodo = async (roomId, todoId) => {
  const todoRef = doc(db, 'studyRooms', roomId, 'todos', todoId);
  await deleteDoc(todoRef);
};

/**
 * Subscribe to room todos (real-time)
 */
export const subscribeToRoomTodos = (roomId, callback) => {
  const todosRef = collection(db, 'studyRooms', roomId, 'todos');
  const q = query(todosRef, orderBy('createdAt', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(todos);
  });
};

// ==================== ROOM PLAYLIST ====================

/**
 * Update room's shared playlist URL
 */
export const updateRoomPlaylist = async (roomId, spotifyUrl, updatedById = null, updatedByName = null) => {
  const roomRef = doc(db, 'studyRooms', roomId);
  await updateDoc(roomRef, {
    spotifyUrl: spotifyUrl,
    playlistUpdatedById: updatedById,
    playlistUpdatedByName: updatedByName,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Update room background (shared)
 */
export const updateRoomBackground = async (roomId, backgroundUrl, updatedById = null, updatedByName = null) => {
  const roomRef = doc(db, 'studyRooms', roomId);
  await updateDoc(roomRef, {
    backgroundUrl,
    backgroundUpdatedById: updatedById,
    backgroundUpdatedByName: updatedByName,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Signal shared playback action (e.g., 'play' | 'pause')
 */
export const signalRoomPlayback = async (roomId, action, updatedById = null, updatedByName = null) => {
  const roomRef = doc(db, 'studyRooms', roomId);
  await updateDoc(roomRef, {
    playerAction: action,
    playerUpdatedById: updatedById,
    playerUpdatedByName: updatedByName,
    playerAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

// ==================== ROOM FILES (UPLOAD NOTES) ====================

/**
 * Add file metadata to room (for real-time list). For actual file storage, integrate Firebase Storage.
 */
export const addRoomFileMetadata = async (roomId, file) => {
  const filesRef = collection(db, 'studyRooms', roomId, 'files');
  await addDoc(filesRef, {
    name: file.name,
    size: file.size,
    type: file.type || null,
    uploadedById: file.uploadedById || null,
    uploadedByName: file.uploadedByName || 'User',
    uploadedAt: serverTimestamp(),
  });
};

export const subscribeToRoomFiles = (roomId, callback) => {
  const filesRef = collection(db, 'studyRooms', roomId, 'files');
  const q = query(filesRef, orderBy('uploadedAt', 'desc'), limit(100));
  return onSnapshot(q, (snapshot) => {
    const files = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(files);
  });
};

export const deleteRoomFile = async (roomId, fileId) => {
  const fileRef = doc(db, 'studyRooms', roomId, 'files', fileId);
  await deleteDoc(fileRef);
};

/**
 * Backfill legacy todos without creator fields by assigning to current user
 */
export const backfillRoomTodosCreators = async (roomId, userId, displayName, photoURL = null) => {
  const todosRef = collection(db, 'studyRooms', roomId, 'todos');
  const snap = await getDocs(todosRef);
  if (snap.empty) return 0;
  const batch = writeBatch(db);
  let count = 0;
  snap.docs.forEach((d) => {
    const data = d.data();
    if (!data.createdById || !data.createdByName) {
      const todoRef = doc(db, 'studyRooms', roomId, 'todos', d.id);
      batch.update(todoRef, {
        createdById: userId,
        createdByName: displayName || 'User',
        createdByPhotoURL: photoURL || null,
        updatedAt: serverTimestamp(),
      });
      count += 1;
    }
  });
  if (count > 0) {
    await batch.commit();
  }
  return count;
};

// ==================== LEADERBOARD ====================

/**
 * Get top users by points (real-time leaderboard)
 */
export const getLeaderboard = (callback, limitCount = 50) => {
  const q = query(
    collection(db, 'users'),
    orderBy('points', 'desc'),
    limit(limitCount)
  );
  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map((doc, index) => ({
      id: doc.id,
      rank: index + 1,
      ...doc.data(),
    }));
    callback(users);
  });
};

/**
 * Get top users by study time
 */
export const getLeaderboardByStudyTime = (callback, limitCount = 50) => {
  const q = query(
    collection(db, 'users'),
    orderBy('totalStudyTime', 'desc'),
    limit(limitCount)
  );
  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map((doc, index) => ({
      id: doc.id,
      rank: index + 1,
      ...doc.data(),
    }));
    callback(users);
  });
};

// ==================== NOTES & TODOS ====================

/**
 * Save user note
 */
export const saveNote = async (userId, noteData) => {
  const noteRef = doc(collection(db, 'users', userId, 'notes'));
  await setDoc(noteRef, {
    ...noteData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return noteRef.id;
};

/**
 * Update note
 */
export const updateNote = async (userId, noteId, updates) => {
  const noteRef = doc(db, 'users', userId, 'notes', noteId);
  await updateDoc(noteRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete note
 */
export const deleteNote = async (userId, noteId) => {
  const noteRef = doc(db, 'users', userId, 'notes', noteId);
  await deleteDoc(noteRef);
};

/**
 * Subscribe to user notes (real-time)
 */
export const subscribeToNotes = (userId, callback) => {
  const q = query(
    collection(db, 'users', userId, 'notes'),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(notes);
  });
};

/**
 * Save todo item
 */
export const saveTodo = async (userId, todoData) => {
  const todoRef = doc(collection(db, 'users', userId, 'todos'));
  await setDoc(todoRef, {
    ...todoData,
    completed: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return todoRef.id;
};

/**
 * Update todo
 */
export const updateTodo = async (userId, todoId, updates) => {
  const todoRef = doc(db, 'users', userId, 'todos', todoId);
  await updateDoc(todoRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete todo
 */
export const deleteTodo = async (userId, todoId) => {
  const todoRef = doc(db, 'users', userId, 'todos', todoId);
  await deleteDoc(todoRef);
};

/**
 * Subscribe to user todos (real-time)
 */
export const subscribeToTodos = (userId, callback) => {
  const q = query(
    collection(db, 'users', userId, 'todos'),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(todos);
  });
};

// ==================== ACCOUNT CLEANUP ====================

/**
 * Delete a user's Firestore footprint so they no longer appear on the leaderboard.
 * This removes:
 * - users/{userId}
 * - users/{userId}/notes/*
 * - users/{userId}/todos/*
 * - studySessions where userId == {userId}
 * - presence documents across rooms (best-effort via collection group)
 *
 * Note: Large accounts may exceed a single batch; current implementation is best-effort
 * and suitable for typical personal usage sizes.
 */
export const deleteUserData = async (userId) => {
  // Collect deletes in batches of up to ~400 ops per commit to stay safe
  const commitBatches = async (ops) => {
    let batch = writeBatch(db);
    let count = 0;
    const commits = [];
    for (const op of ops) {
      batch.delete(op);
      count += 1;
      if (count >= 400) {
        commits.push(batch.commit());
        batch = writeBatch(db);
        count = 0;
      }
    }
    if (count > 0) commits.push(batch.commit());
    if (commits.length) await Promise.all(commits);
  };

  const ops = [];

  // Subcollections: notes and todos
  const notesSnap = await getDocs(collection(db, 'users', userId, 'notes'));
  notesSnap.forEach((d) => ops.push(doc(db, 'users', userId, 'notes', d.id)));

  const todosSnap = await getDocs(collection(db, 'users', userId, 'todos'));
  todosSnap.forEach((d) => ops.push(doc(db, 'users', userId, 'todos', d.id)));

  // Top-level study sessions for this user
  const ssQuery = query(collection(db, 'studySessions'), where('userId', '==', userId));
  const ssSnap = await getDocs(ssQuery);
  ssSnap.forEach((d) => ops.push(doc(db, 'studySessions', d.id)));

  // Presence docs across rooms (collection group)
  try {
    const presenceGroup = collectionGroup(db, 'presence');
    const presenceSnap = await getDocs(query(presenceGroup, where('userId', '==', userId)));
    presenceSnap.forEach((d) => ops.push(d.ref));
  } catch {
    // collectionGroup might fail if not indexed; ignore best-effort
  }

  // Finally, the user profile document itself
  ops.push(doc(db, 'users', userId));

  await commitBatches(ops);
};
