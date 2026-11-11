/**
 * useSocket.js
 * Drop-in hook for FocusoraHQ study room real-time features.
 *
 * Usage:
 *   const { socket, connected } = useSocket();
 *
 * Import this once high up (e.g. StudyRoomContext) and pass socket down,
 * or call it directly inside a room page component.
 */

import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '')   // strip /api suffix
  : '';                                                  // empty → same origin (Vite proxy)

/**
 * @returns {{ socket: import('socket.io-client').Socket | null, connected: boolean }}
 */
export function useSocket() {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io(SERVER_URL, {
      // Use the Vite proxy in dev (/socket.io → localhost:5000/socket.io)
      // In production SERVER_URL is the full backend URL
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      console.log('[socket] connected', socket.id);
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('[socket] disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { socket: socketRef.current, connected };
}
