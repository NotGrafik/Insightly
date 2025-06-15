// back/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import surveyRoutes from './routes/surveyRoutes.js';
import userRoutes from './routes/userRoutes.js';
import connectDB from './config/db.js';

dotenv.config();
const app = express();

// Middlewares
app.use(cors({
  origin: 'insightly-sigma.vercel.app',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/survey', surveyRoutes);
app.use('/user', userRoutes);

connectDB().then(() => {
  app.listen(3001, () => {
    console.log('✅ Backend server running on http://localhost:3001');
  });
});
