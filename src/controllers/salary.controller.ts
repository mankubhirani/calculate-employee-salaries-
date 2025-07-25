import prisma from '../config/prisma';
import { Request, Response } from 'express';

export const calculateSalary = (req: Request, res: Response) => {
  const { basic, hra, allowances, deductions, pf, tax } = req.body;

  const grossSalary = basic + hra + allowances;
  const totalDeductions = deductions + pf + tax;
  const netSalary = grossSalary - totalDeductions;

  res.status(200).json({
    message: 'Salary calculated successfully',
    data: {
      basic,
      hra,
      allowances,
      deductions,
      pf,
      tax,
      grossSalary,
      netSalary
    }
  });
};

export const getAllSalaries = (req: Request, res: Response) => {
  // Placeholder for fetching all salary data
  res.status(200).json({ message: 'All salaries fetched', data: [] });
};

export const getSalary = async (req: Request, res: Response) => {
  try {
    const employeeId = Number(req.params.employeeId);
    const month = req.query.month as string; // format: YYYY-MM

    const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        employeeId,
        date: { gte: startDate, lt: endDate }
      }
    });

    const grossSalary = employee.basicSalary + employee.hra + employee.allowance;
    const pf = employee.basicSalary * 0.12;
    const tax = grossSalary < 50000 ? grossSalary * 0.05 : grossSalary * 0.10;
    const workingDays = attendanceRecords.length || 1;
    const dailyWage = grossSalary / workingDays;

    let fullDays = 0, halfDays = 0;
    attendanceRecords.forEach(a => {
      if (a.hoursWorked >= 8) fullDays++;
      else halfDays++;
    });

    const totalSalary = (fullDays * dailyWage) + (halfDays * (dailyWage / 2));
    const netSalary = totalSalary - tax - pf;

    res.json({
      success: true,
      data: {
        employeeId,
        month,
        grossSalary,
        pf,
        tax,
        fullDays,
        halfDays,
        totalSalary,
        netSalary
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
