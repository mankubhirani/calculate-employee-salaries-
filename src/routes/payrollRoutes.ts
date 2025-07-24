import express from 'express';
import { calculateMonthlyPayroll } from '../controllers/payroll.controller';

const router = express.Router();

router.get('/calculate', calculateMonthlyPayroll);

export default router;
