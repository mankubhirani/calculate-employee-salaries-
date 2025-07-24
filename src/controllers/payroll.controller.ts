import { Request, Response } from 'express';

// Dummy employee salary data
const employees = [
  {
    id: 1,
    name: 'Mohit',
    basic: 30000,
    hra: 10000,
    allowances: 5000,
    deductions: 2000,
    pf: 1800,
    tax: 2200
  },
  {
    id: 2,
    name: 'Amit',
    basic: 25000,
    hra: 8000,
    allowances: 4000,
    deductions: 1500,
    pf: 1500,
    tax: 2000
  }
];

export const calculateMonthlyPayroll = (req: Request, res: Response) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Month query param is required (e.g., ?month=2025-07)' });
  }

  let totalPayout = 0;
  const salaryDetails = employees.map(emp => {
    const gross = emp.basic + emp.hra + emp.allowances;
    const totalDeductions = emp.deductions + emp.pf + emp.tax;
    const net = gross - totalDeductions;
    totalPayout += net;

    return {
      employeeId: emp.id,
      name: emp.name,
      netSalary: net
    };
  });

  res.status(200).json({
    message: `Payroll for ${month} calculated`,
    totalPayout,
    employees: salaryDetails
  });
};
