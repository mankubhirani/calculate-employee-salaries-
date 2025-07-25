import express from 'express';
import { calculateMonthlyPayroll, distributePayroll, getPayrollHistory } from '../controllers/payroll.controller';

const router = express.Router();

router.get('/calculate', calculateMonthlyPayroll);
router.post('/distribute', distributePayroll);
router.get('/history', getPayrollHistory);

export default router;
