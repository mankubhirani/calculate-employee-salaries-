import prisma from '../config/prisma';

export const createEmployee = async (data: any) => {
  if (!data.hashedPassword) {
    throw new Error('Password is required and must be hashed before saving.');
  }
  return await prisma.employee.create({
    data: {
      name: data.name,
      basicSalary: data.basicSalary,
      hra: data.hra,
      allowance: data.allowance,
      user: {
        create: {
          email: data.email,
          password: data.hashedPassword, // Ensure this is a string
          role: 'Employee'
        }
      }
    }
  });
};
