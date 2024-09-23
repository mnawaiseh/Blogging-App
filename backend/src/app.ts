import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

export default app;
