import express from 'express';
import { markAttendance, getAttendance } from '../controllers/attendance.controller';

const router = express.Router();

router.post('/mark', markAttendance);
router.get('/', getAttendance);

export default router;
