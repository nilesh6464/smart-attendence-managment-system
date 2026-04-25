const Attendance = require('../models/Attendance');

exports.punchIn = async (req, res) => {
  try {
    const { selfie, latitude, longitude } = req.body;
    const today = new Date().setHours(0, 0, 0, 0);

    // Check if already punched in today
    const existing = await Attendance.findOne({ userId: req.user._id, date: today });
    if (existing) {
      return res.status(400).json({ 
        message: 'You have already punched in today. Please punch out first.',
        attendance: existing 
      });
    }

    const attendance = await Attendance.create({
      userId: req.user._id,
      date: today,
      punchIn: { time: new Date(), selfie, location: { latitude, longitude } }
    });

    res.status(201).json(attendance);
  } catch (error) {
    console.error('Punch In Error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already punched in today' });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.punchOut = async (req, res) => {
  try {
    const { selfie, latitude, longitude } = req.body;
    const today = new Date().setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({ userId: req.user._id, date: today });
    if (!attendance) return res.status(404).json({ message: 'No punch-in record found' });
    if (attendance.punchOut.time) return res.status(400).json({ message: 'Already punched out' });

    const punchOutTime = new Date();
    const workingHours = (punchOutTime - attendance.punchIn.time) / (1000 * 60 * 60);

    attendance.punchOut = { time: punchOutTime, selfie, location: { latitude, longitude } };
    attendance.workingHours = workingHours;
    attendance.status = workingHours >= 8 ? 'completed' : 'incomplete';
    await attendance.save();

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate('userId', 'name email').sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.validateAttendance = async (req, res) => {
  try {
    const { isValid, remarks } = req.body;
    const attendance = await Attendance.findById(req.params.id);
    
    if (!attendance) return res.status(404).json({ message: 'Attendance not found' });

    attendance.isValid = isValid;
    attendance.remarks = remarks || '';
    await attendance.save();

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.requestOvertime = async (req, res) => {
  try {
    const { attendanceId, overtimeHours } = req.body;
    const attendance = await Attendance.findById(attendanceId);

    if (!attendance || attendance.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Attendance not found' });
    }

    attendance.overtimeRequested = true;
    attendance.overtimeHours = overtimeHours;
    attendance.overtimeStatus = 'pending';
    await attendance.save();

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveOvertime = async (req, res) => {
  try {
    const { status } = req.body;
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) return res.status(404).json({ message: 'Attendance not found' });

    attendance.overtimeStatus = status;
    if (status === 'approved') {
      attendance.workingHours += attendance.overtimeHours;
    }
    await attendance.save();

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDailyReport = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0);

    const report = await Attendance.find({ date: targetDate }).populate('userId', 'name email');
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTodayAttendance = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const attendance = await Attendance.findOne({ userId: req.user._id, date: today });
    res.json(attendance || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
