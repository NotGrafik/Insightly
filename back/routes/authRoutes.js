import express from 'express';
import { login, register, logout } from '../controllers/authController.js';
import { me } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';


const router = express.Router();
router.get('/me', authenticate, me);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;