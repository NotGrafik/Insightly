import express from 'express';
import { getUser, getSurveys, updateUser } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/get', authenticate, getUser);
router.get('/surveys', authenticate, getSurveys);
router.put('/update', authenticate, updateUser);

export default router;