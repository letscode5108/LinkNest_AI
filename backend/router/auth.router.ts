import { Router } from 'express';
import { createAccount, login, logout, refreshToken, getProfile } from '../controller/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();


router.post('/register', createAccount);
router.post('/create-account', createAccount); 
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);


router.get('/profile', authenticateToken, getProfile);
router.get('/me', authenticateToken, getProfile); 

export default router;