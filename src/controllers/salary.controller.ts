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
