import express from 'express';
import { calculateSalary, getAllSalaries } from '../controllers/salary.controller';

const router = express.Router();

router.post('/calculate', calculateSalary);
router.get('/', getAllSalaries);

export default router;
