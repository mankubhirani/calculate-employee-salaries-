import prisma from '../config/prisma';

export const createEmployee = async (data: any) => {
  return await prisma.employee.create({
    data: {
      name: data.name,
      basicSalary: data.basicSalary,
      hra: data.hra,
      allowance: data.allowance,
      user: {
        create: {
          email: data.email,
          password: data.hashedPassword,
          role: 'Employee'
        }
      }
    }
  });
};
