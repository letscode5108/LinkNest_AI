import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'your-secret-key';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'Access token is required' });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    
    req.user = user;
    next();
  } catch (error) {
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Authentication failed:', error instanceof jwt.JsonWebTokenError ? 'Invalid token' : error);
    }
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};