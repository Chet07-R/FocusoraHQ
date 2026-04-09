const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

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

    socket.on('timer-update', ({ roomId, timerData }) => {
      if (roomId) {
        socket.to(roomId).emit('timer-update', timerData);
      }
    });

    socket.on('send-message', ({ roomId, message }) => {
      if (roomId) {
        ioInstance.to(roomId).emit('receive-message', message);
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
