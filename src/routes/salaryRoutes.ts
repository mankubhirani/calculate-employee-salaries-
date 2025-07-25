import express from 'express';
import { calculateSalary, getAllSalaries, getSalary } from '../controllers/salary.controller';

const router = express.Router();

router.post('/calculate', calculateSalary);
router.get('/', getAllSalaries);
router.get('/:employeeId', getSalary); // Add this line

export default router;
