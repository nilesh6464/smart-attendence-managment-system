const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  punchIn: {
    time: { type: Date, required: true },
    selfie: { type: String, required: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  punchOut: {
    time: Date,
    selfie: String,
    location: {
      latitude: Number,
      longitude: Number
    }
  },
  workingHours: { type: Number, default: 0 },
  status: { type: String, enum: ['incomplete', 'completed'], default: 'incomplete' },
  isValid: { type: String, enum: ['pending', 'valid', 'invalid'], default: 'pending' },
  remarks: { type: String, default: '' },
  overtimeRequested: { type: Boolean, default: false },
  overtimeHours: { type: Number, default: 0 },
  overtimeStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
