import { Router } from 'express';
import { createAccount, login, logout, refreshToken, getProfile } from '../controller/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', createAccount);
router.post('/create-account', createAccount); // Alternative endpoint
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.get('/me', authenticateToken, getProfile); // Alternative endpoint

export default router;