import express from 'express';
import { getAllSondages, create } from '../controllers/surveyController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post('/create', authenticate, create);
router.get('/all', authenticate, getAllSondages)

export default router;