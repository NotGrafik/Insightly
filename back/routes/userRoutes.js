import express from 'express';
import { getUser, getSurveys } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/get', authenticate, getUser);
router.get('/surveys', authenticate, getSurveys);

export default router;