const StudyRoom = require('../models/StudyRoom');
const { ok, fail } = require('../utils/apiResponse');

const createRoom = async (req, res) => {
  const room = await StudyRoom.create({
    name: req.body.name || 'Untitled Room',
    description: req.body.description || '',
    createdBy: req.user._id,
    active: true,
    participants: [
      {
        userId: req.user._id,
        displayName: req.user.displayName,
        photoURL: req.user.photoURL,
      },
    ],
    participantCount: 1,
  });

  return ok(res, room, 201);
};

const listRooms = async (req, res) => {
  const rooms = await StudyRoom.find({ active: true }).sort({ updatedAt: -1 }).limit(100);
  return ok(res, rooms);
};

const getRoom = async (req, res) => {
  const room = await StudyRoom.findById(req.params.id);

  if (!room) {
    return fail(res, 404, 'ROOM_NOT_FOUND', 'Room not found');
  }

  return ok(res, room);
};

const deleteRoom = async (req, res) => {
  const room = await StudyRoom.findById(req.params.id);

  if (!room) {
    return fail(res, 404, 'ROOM_NOT_FOUND', 'Room not found');
  }

  if (String(room.createdBy) !== String(req.user._id)) {
    return fail(res, 403, 'FORBIDDEN', 'Only the room creator can delete this room');
  }

  room.active = false;
  room.participants = [];
  room.participantCount = 0;
  await room.save();

  return ok(res, { success: true, roomId: room._id });
};

module.exports = { createRoom, listRooms, getRoom, deleteRoom };
