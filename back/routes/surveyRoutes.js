import express from 'express';
import { getAllSondages, getSondage, deleteSondage, create, responseToSondage, getResponses } from '../controllers/surveyController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post('/create', authenticate, create);
router.delete('/:id', authenticate, deleteSondage);
router.get('/all', authenticate, getAllSondages);
router.get('/:id', authenticate, getSondage);
router.post('/:id/response', authenticate, responseToSondage);
router.get('/:id/responses', authenticate, getResponses);
router.get('/:surveyId/:questionId', authenticate, isResponse);

export default router;