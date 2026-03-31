const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

let ioInstance = null;

const initSocketServer = (httpServer) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: [env.clientUrl, 'http://localhost:5173'],
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
