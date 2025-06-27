import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Sign } from 'crypto';

const prisma = new PrismaClient();


const JWT_SECRET = process.env.JWT_ACCESS_SECRET ;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ;

interface AuthRequest extends Request {
  user?: any;
}


const generateTokens = (userId: number) => {
  const payload = { userId };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any);
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN } as any);
  return { accessToken, refreshToken };
};


export const createAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, password } = req.body;

    
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long' });
      return;
    }

   
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(400).json({ error: 'User already exists with this email' });
      return;
    }

 
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

   
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    });

   
    const { accessToken, refreshToken } = generateTokens(user.id);

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

   
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    
    const { accessToken, refreshToken } = generateTokens(user.id);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
   
   
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    let { refreshToken } = req.body;
    
    if (!refreshToken) {
      const authHeader = req.headers['authorization'];
      refreshToken = authHeader && authHeader.split(' ')[1];
    }

    if (!refreshToken) {
      res.status(401).json({ error: 'Refresh token is required' });
      return;
    }

   
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: number };
    
   
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid refresh token' });
      return;
    }

    
    const tokens = generateTokens(user.id);

    res.json({
      message: 'Token refreshed successfully',
      ...tokens
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};


export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
