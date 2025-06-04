import express from 'express';
import { getUser } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/get', authenticate, getUser);

export default router;