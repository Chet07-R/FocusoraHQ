const mongoose = require('mongoose');

const activityEventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    points: { type: Number, default: 0 },
    minutes: { type: Number, default: 0 },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

activityEventSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityEvent', activityEventSchema);
