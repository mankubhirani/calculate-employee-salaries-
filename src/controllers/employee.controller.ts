import { Request, Response } from 'express';
import { createEmployee } from '../services/employee.service';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma'; // Add this import

export const addEmployee = async (req: Request, res: Response) => {
  try {
    const { password, ...rest } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await createEmployee({ ...rest, hashedPassword });
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add this function
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      include: { user: true }
    });
    res.json({ success: true, data: employees });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
