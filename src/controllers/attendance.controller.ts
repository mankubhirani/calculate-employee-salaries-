import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const markAttendance = async (req: Request, res: Response) => {
  const { employeeId, date, hoursWorked } = req.body;
  try {
    const attendance = await prisma.attendance.create({
      data: {
        employeeId,
        date: new Date(date), // Convert to Date object
        hoursWorked
      }
    });
    res.status(200).json({ message: 'Attendance marked successfully', data: attendance });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to mark attendance', error: err.message });
  }
};

export const getAttendance = async (req: Request, res: Response) => {
  try {
    const { employeeId, month } = req.query;
    let where: any = {};
    if (employeeId) where.employeeId = Number(employeeId);

    if (month) {
      // month format: YYYY-MM
      const startDate = new Date(`${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      where.date = {
        gte: startDate,
        lt: endDate
      };
    }

    const attendanceRecords = await prisma.attendance.findMany({ where });
    res.status(200).json({ message: 'Attendance fetched successfully', data: attendanceRecords });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch attendance', error: err.message });
  }
};
