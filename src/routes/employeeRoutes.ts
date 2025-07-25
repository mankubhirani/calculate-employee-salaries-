import express from 'express';
import { addEmployee, getEmployees } from '../controllers/employee.controller';

const router = express.Router();

router.post('/', addEmployee);
router.get('/', getEmployees); // Add this line

export default router;
