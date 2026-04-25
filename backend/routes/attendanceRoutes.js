const express = require('express');
const {
  punchIn,
  punchOut,
  getMyAttendance,
  getAllAttendance,
  validateAttendance,
  requestOvertime,
  approveOvertime,
  getDailyReport,
  getTodayAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/punch-in', protect, punchIn);
router.post('/punch-out', protect, punchOut);
router.get('/my-attendance', protect, getMyAttendance);
router.get('/today', protect, getTodayAttendance);
router.get('/all', protect, authorize('manager', 'admin'), getAllAttendance);
router.put('/validate/:id', protect, authorize('manager', 'admin'), validateAttendance);
router.post('/overtime/request', protect, requestOvertime);
router.put('/overtime/approve/:id', protect, authorize('manager', 'admin'), approveOvertime);
router.get('/report', protect, authorize('manager', 'admin'), getDailyReport);

module.exports = router;
