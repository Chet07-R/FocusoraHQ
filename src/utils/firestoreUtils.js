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


export const getUserProfile = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};


export const updateUserProfile = async (userId, updates) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};


export const subscribeToUserProfile = (userId, callback) => {
  const userRef = doc(db, 'users', userId);
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    }
  });
};


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


export const endStudySession = async (sessionId, userId, durationMinutes) => {
  const sessionRef = doc(db, 'studySessions', sessionId);
  const userRef = doc(db, 'users', userId);

  // Update session
  await updateDoc(sessionRef, {
    endTime: serverTimestamp(),
    duration: durationMinutes,
    active: false,
  });


  await updateDoc(userRef, {
    totalStudyTime: increment(durationMinutes),
    studySessions: increment(1),
    points: increment(Math.floor(durationMinutes / 5)), 
    updatedAt: serverTimestamp(),
  });
};

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


export const createStudyRoom = async (roomData) => {

  const makeId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
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


export const joinStudyRoom = async (roomId, userData) => {
  const roomRef = doc(db, 'studyRooms', roomId);
  const presenceRef = doc(db, 'studyRooms', roomId, 'presence', userData.userId);


  await updateDoc(roomRef, {
    participants: arrayUnion(userData.userId),
    participantCount: increment(1),
    updatedAt: serverTimestamp(),
  });


  await setDoc(presenceRef, {
    userId: userData.userId,
    displayName: userData.displayName,
    photoURL: userData.photoURL || null,
    joinedAt: serverTimestamp(),
    lastActive: serverTimestamp(),
    status: 'active',
  });
};


export const leaveStudyRoom = async (roomId, userId) => {
  const roomRef = doc(db, 'studyRooms', roomId);
  const presenceRef = doc(db, 'studyRooms', roomId, 'presence', userId);


  await updateDoc(roomRef, {
    participants: arrayRemove(userId),
    participantCount: increment(-1),
    updatedAt: serverTimestamp(),
  });


  await deleteDoc(presenceRef);
};


export const updateRoomPresence = async (roomId, userId) => {
  const presenceRef = doc(db, 'studyRooms', roomId, 'presence', userId);
  await updateDoc(presenceRef, {
    lastActive: serverTimestamp(),
    status: 'active',
  });
};


export const setRoomPresenceStatus = async (roomId, userId, status) => {
  const presenceRef = doc(db, 'studyRooms', roomId, 'presence', userId);
  const update = { status };
  if (status === 'active') update.lastActive = serverTimestamp();
  await updateDoc(presenceRef, update);
};

export const deleteStudyRoom = async (roomId) => {
  const roomRef = doc(db, 'studyRooms', roomId);
  

  await updateDoc(roomRef, {
    active: false,
    participants: [],
    participantCount: 0,
    closedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};


export const subscribeToStudyRoom = (roomId, callback) => {
  const roomRef = doc(db, 'studyRooms', roomId);
  return onSnapshot(roomRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    }
  });
};

export const subscribeToRoomParticipants = (roomId, callback) => {
  const presenceCollection = collection(db, 'studyRooms', roomId, 'presence');
  return onSnapshot(presenceCollection, (snapshot) => {
    const participants = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(participants);
  });
};


export const updateRoomTimer = async (roomId, timerData) => {
  const roomRef = doc(db, 'studyRooms', roomId);
  await updateDoc(roomRef, {
    timer: timerData,
    updatedAt: serverTimestamp(),
  });
};


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


export const sendRoomChatMessage = async (roomId, userId, displayName, message) => {
  const messagesRef = collection(db, 'studyRooms', roomId, 'messages');
  await addDoc(messagesRef, {
    userId,
    displayName: displayName || 'User',
    message,
    timestamp: serverTimestamp(),
  });
};


export const subscribeToRoomChat = (roomId, callback) => {
  const messagesRef = collection(db, 'studyRooms', roomId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(100));
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
};

export const updateRoomNotes = async (roomId, notes, updatedById = null, updatedByName = null) => {
  const roomRef = doc(db, 'studyRooms', roomId);
  await updateDoc(roomRef, {
    sharedNotes: notes,
    notesUpdatedById: updatedById,
    notesUpdatedByName: updatedByName,
    updatedAt: serverTimestamp(),
  });
};


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

export const toggleRoomTodo = async (roomId, todoId, completed) => {
  const todoRef = doc(db, 'studyRooms', roomId, 'todos', todoId);
  await updateDoc(todoRef, {
    completed,
    updatedAt: serverTimestamp(),
  });
};


export const deleteRoomTodo = async (roomId, todoId) => {
  const todoRef = doc(db, 'studyRooms', roomId, 'todos', todoId);
  await deleteDoc(todoRef);
};


export const subscribeToRoomTodos = (roomId, callback) => {
  const todosRef = collection(db, 'studyRooms', roomId, 'todos');
  const q = query(todosRef, orderBy('createdAt', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(todos);
  });
};


export const updateRoomPlaylist = async (roomId, spotifyUrl, updatedById = null, updatedByName = null) => {
  const roomRef = doc(db, 'studyRooms', roomId);
  await updateDoc(roomRef, {
    spotifyUrl: spotifyUrl,
    playlistUpdatedById: updatedById,
    playlistUpdatedByName: updatedByName,
    updatedAt: serverTimestamp(),
  });
};


export const updateRoomBackground = async (roomId, backgroundUrl, updatedById = null, updatedByName = null) => {
  const roomRef = doc(db, 'studyRooms', roomId);
  await updateDoc(roomRef, {
    backgroundUrl,
    backgroundUpdatedById: updatedById,
    backgroundUpdatedByName: updatedByName,
    updatedAt: serverTimestamp(),
  });
};


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


export const saveNote = async (userId, noteData) => {
  const noteRef = doc(collection(db, 'users', userId, 'notes'));
  await setDoc(noteRef, {
    ...noteData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return noteRef.id;
};


export const updateNote = async (userId, noteId, updates) => {
  const noteRef = doc(db, 'users', userId, 'notes', noteId);
  await updateDoc(noteRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteNote = async (userId, noteId) => {
  const noteRef = doc(db, 'users', userId, 'notes', noteId);
  await deleteDoc(noteRef);
};


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

export const updateTodo = async (userId, todoId, updates) => {
  const todoRef = doc(db, 'users', userId, 'todos', todoId);
  await updateDoc(todoRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};


export const deleteTodo = async (userId, todoId) => {
  const todoRef = doc(db, 'users', userId, 'todos', todoId);
  await deleteDoc(todoRef);
};


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


export const deleteUserData = async (userId) => {

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

  
  const notesSnap = await getDocs(collection(db, 'users', userId, 'notes'));
  notesSnap.forEach((d) => ops.push(doc(db, 'users', userId, 'notes', d.id)));

  const todosSnap = await getDocs(collection(db, 'users', userId, 'todos'));
  todosSnap.forEach((d) => ops.push(doc(db, 'users', userId, 'todos', d.id)));


  const ssQuery = query(collection(db, 'studySessions'), where('userId', '==', userId));
  const ssSnap = await getDocs(ssQuery);
  ssSnap.forEach((d) => ops.push(doc(db, 'studySessions', d.id)));


  try {
    const presenceGroup = collectionGroup(db, 'presence');
    const presenceSnap = await getDocs(query(presenceGroup, where('userId', '==', userId)));
    presenceSnap.forEach((d) => ops.push(d.ref));
  } catch {

  }


  ops.push(doc(db, 'users', userId));

  await commitBatches(ops);
};
