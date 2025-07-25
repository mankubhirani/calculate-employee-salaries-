import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /payroll/calculate?month=YYYY-MM
export const calculateMonthlyPayroll = async (req: Request, res: Response) => {
  const { month } = req.query;
  if (!month) {
    return res.status(400).json({ error: 'Month query param is required (e.g., ?month=2025-07)' });
  }

  const employees = await prisma.employee.findMany();
  let totalPayout = 0;
  const salaryDetails = employees.map(emp => {
    const gross = emp.basicSalary + emp.hra + emp.allowance;
    // Dummy values for tax, pf, deductions (replace with your logic or fetch from Attendance/Salary)
    const tax = 2000;
    const pf = 1800;
    const deductions = 1500;
    const net = gross - (tax + pf + deductions);
    totalPayout += net;
    return {
      employeeId: emp.id,
      name: emp.name,
      gross,
      tax,
      pf,
      deductions,
      netSalary: net
    };
  });

  res.status(200).json({
    message: `Payroll for ${month} calculated`,
    totalPayout,
    employees: salaryDetails
  });
};

// POST /payroll/distribute { month: "YYYY-MM" }
export const distributePayroll = async (req: Request, res: Response) => {
  const { month } = req.body;
  if (!month) {
    return res.status(400).json({ error: 'Month is required in body.' });
  }

  const employees = await prisma.employee.findMany();
  let totalPayout = 0;
  for (const emp of employees) {
    const gross = emp.basicSalary + emp.hra + emp.allowance;
    const tax = 2000;
    const pf = 1800;
    const deductions = 1500;
    const net = gross - (tax + pf + deductions);
    totalPayout += net;

    // Insert salary record for each employee
    await prisma.salary.create({
      data: {
        employeeId: emp.id,
        month,
        gross,
        tax,
        pf,
        net,
        deductions
      }
    });
  }

  // Insert payroll summary for the month
  await prisma.payroll.create({
    data: {
      month,
      total: totalPayout
    }
  });

  res.status(200).json({
    message: `Payroll for ${month} distributed`,
    totalPayout
  });
};

// GET /payroll/history?month=YYYY-MM
export const getPayrollHistory = async (req: Request, res: Response) => {
  const { month } = req.query;
  if (!month) {
    return res.status(400).json({ error: 'Month query param is required (e.g., ?month=2025-07)' });
  }

  // Get payroll summary
  const payroll = await prisma.payroll.findFirst({ where: { month: String(month) } });
  if (!payroll) {
    return res.status(404).json({ error: 'No payroll history found for this month.' });
  }

  // Get all salary records for the month
  const salaries = await prisma.salary.findMany({
    where: { month: String(month) },
    include: { employee: true }
  });

  res.status(200).json({
    payroll,
    salaries
  });
};
