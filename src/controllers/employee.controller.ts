import { Request, Response } from 'express';
import { createEmployee } from '../services/employee.service';

export const addEmployee = async (req: Request, res: Response) => {
  try {
    const result = await createEmployee(req.body);
    res.json({ success: true, data: result });
  } catch (err:any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
