import express from 'express';
import { getAllSondages, getSondage, deleteSondage, updateSondage, create, responseToSondage, getResponses, isResponse } from '../controllers/surveyController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post('/create', authenticate, create);
router.delete('/:id', authenticate, deleteSondage);
router.put('/:id', authenticate, updateSondage);
router.get('/all', authenticate, getAllSondages);
router.get('/:id', authenticate, getSondage);
router.post('/:id/response', authenticate, responseToSondage);
router.get('/:id/responses', authenticate, getResponses);
router.get('/:surveyId/:questionId', authenticate, isResponse);

export default router;