import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'; // Use .env

/**
 * Registers a new user.
 * 
 * @param req - Express request object containing the user's email and password in the body.
 * @param res - Express response object used to send the response.
 * 
 * @returns A 201 response with a JWT token and user data if registration is successful. 
 *          A 400 response if the user already exists.
 */
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return res.status(400).json({ error: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashedPassword } });

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
  res.status(201).json({ token, user });
};

/**
 * Logs in an existing user.
 * 
 * @param req - Express request object containing the user's email and password in the body.
 * @param res - Express response object used to send the response.
 * 
 * @returns A 200 response with a JWT token and user data if login is successful.
 *          A 401 response if the email or password is incorrect.
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user });
};
