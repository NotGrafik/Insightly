import express from 'express';
import { getUser, getSurveys, updateUser, requestPasswordReset, resetPassword } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/get', authenticate, getUser);
router.get('/get/:id', authenticate, getOtherUser);
router.get('/surveys', authenticate, getSurveys);
router.put('/update', authenticate, updateUser);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

export default router;