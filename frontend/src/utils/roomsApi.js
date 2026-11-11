/**
 * roomsApi.js  —  put this in  src/utils/roomsApi.js
 *
 * Thin axios wrapper for the /api/rooms endpoints.
 * Reads VITE_API_URL from env; falls back to relative /api (Vite proxy).
 */

import axios from 'axios';

const BASE = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');

const http = axios.create({ baseURL: BASE, withCredentials: true });

/**
 * Fetch all public rooms.
 * @returns {Promise<Room[]>}
 */
export async function listRooms() {
  const { data } = await http.get('/rooms');
  return data;
}

/**
 * Fetch a single room by id.
 * @param {string} id
 * @returns {Promise<Room>}
 */
export async function getRoom(id) {
  const { data } = await http.get(`/rooms/${id}`);
  return data;
}

/**
 * Create a new study room.
 * @param {{ name: string, subject: string, host: string, hostName: string, isPrivate: boolean, password?: string }} payload
 * @returns {Promise<Room>}
 */
export async function createRoom(payload) {
  const { data } = await http.post('/rooms', payload);
  return data;
}

/**
 * @typedef {{ id: string, name: string, subject: string, host: string, hostName: string,
 *             isPrivate: boolean, memberCount: number, createdAt: number }} Room
 */
