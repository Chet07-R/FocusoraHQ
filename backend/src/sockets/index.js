const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const StudyRoom = require('../models/StudyRoom');

let ioInstance = null;

const localhostOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;
const privateNetworkOriginPattern = /^https?:\/\/(10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/i;
const configuredOrigins = new Set(
  String(env.clientUrl || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
);

const initSocketServer = (httpServer) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin(origin, callback) {
        if (!origin) {
          return callback(null, true);
        }

        const allowPrivateDevOrigin = env.nodeEnv !== 'production' && privateNetworkOriginPattern.test(origin);

        if (configuredOrigins.has(origin) || localhostOriginPattern.test(origin) || allowPrivateDevOrigin) {
          return callback(null, true);
        }

        return callback(new Error(`Socket CORS blocked origin: ${origin}`));
      },
      methods: ['GET', 'POST'],
    },
  });

  ioInstance.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!token) {
      return next();
    }

    try {
      const payload = jwt.verify(token, env.jwtSecret);
      socket.data.userId = payload.sub;
      return next();
    } catch (error) {
      return next(new Error('Unauthorized socket token'));
    }
  });

  ioInstance.on('connection', (socket) => {
    socket.on('join-room', ({ roomId, user }) => {
      if (!roomId) {
        return;
      }

      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.user = user;
      ioInstance.to(roomId).emit('user-joined', { roomId, user });
    });

    socket.on('leave-room', ({ roomId, user }) => {
      if (!roomId) {
        return;
      }

      socket.leave(roomId);
      ioInstance.to(roomId).emit('user-left', { roomId, user });
    });

    socket.on('timer-update', async ({ roomId, timerData }) => {
      if (!roomId || !timerData) {
        return;
      }

      socket.to(roomId).emit('timer-update', timerData);

      try {
        await StudyRoom.findByIdAndUpdate(roomId, {
          timer: {
            duration: Math.max(0, Number(timerData.duration || 0) || 0),
            remaining: Math.max(0, Number(timerData.remaining || 0) || 0),
            isRunning: Boolean(timerData.isRunning),
            startedAt: timerData.startedAt || null,
            lastUpdatedAt: new Date(),
          },
        });

        ioInstance.to(roomId).emit('room-data-updated', { roomId });
      } catch (error) {
        console.error('Failed to persist room timer', error);
      }
    });

    socket.on('send-message', async ({ roomId, message }) => {
      if (!roomId || !message) {
        return;
      }

      ioInstance.to(roomId).emit('receive-message', message);

      try {
        const room = await StudyRoom.findById(roomId);
        if (!room) return;

        const timestampValue = message.timestamp ? new Date(message.timestamp) : new Date();

        const chatMessage = {
          id: String(message.id || `${Date.now()}`),
          userId: String(message.userId || ''),
          displayName: String(message.displayName || ''),
          message: String(message.message || message.text || '').trim(),
          timestamp: Number.isNaN(timestampValue.getTime()) ? new Date().toISOString() : timestampValue.toISOString(),
        };

        room.chatMessages = [...(room.chatMessages || []), chatMessage].slice(-200);
        await room.save();

        ioInstance.to(roomId).emit('room-data-updated', { roomId });
      } catch (error) {
        console.error('Failed to persist room chat', error);
      }
    });

    socket.on('share-notes', ({ roomId, notes }) => {
      if (roomId) {
        socket.to(roomId).emit('share-notes', notes);
      }
    });

    socket.on('todo-added', ({ roomId, todo }) => {
      if (roomId) {
        ioInstance.to(roomId).emit('todo-received', todo);
      }
    });

    socket.on('todo-toggled', ({ roomId, todoId, completed }) => {
      if (roomId && todoId) {
        ioInstance.to(roomId).emit('todo-toggled-received', { todoId, completed });
      }
    });

    socket.on('todo-deleted', ({ roomId, todoId }) => {
      if (roomId && todoId) {
        ioInstance.to(roomId).emit('todo-deleted-received', { todoId });
      }
    });

    socket.on('update-playlist', ({ roomId, spotifyUrl }) => {
      if (roomId) {
        socket.to(roomId).emit('update-playlist', { roomId, spotifyUrl });
      }
    });

    socket.on('update-background', ({ roomId, backgroundUrl }) => {
      if (roomId) {
        socket.to(roomId).emit('update-background', { roomId, backgroundUrl });
      }
    });

    socket.on('sync-playback', ({ roomId, action, updatedById, updatedByName }) => {
      if (roomId && action) {
        socket.to(roomId).emit('sync-playback', { roomId, action, updatedById, updatedByName, at: Date.now() });
      }
    });

    socket.on('disconnect', () => {
      if (socket.data.roomId && socket.data.user) {
        ioInstance.to(socket.data.roomId).emit('user-left', {
          roomId: socket.data.roomId,
          user: socket.data.user,
        });
      }
    });
  });

  return ioInstance;
};

const getSocketServer = () => ioInstance;

module.exports = { initSocketServer, getSocketServer };
