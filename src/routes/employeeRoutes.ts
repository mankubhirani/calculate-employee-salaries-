import express from 'express';
import { addEmployee } from '../controllers/employee.controller';

const router = express.Router();

router.post('/', addEmployee);

export default router;
