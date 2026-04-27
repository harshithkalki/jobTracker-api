import express from 'express';
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import documentRoutes from './routes/documents';
import cors from 'cors';

const app=express();
app.use(cors({
  origin: ['http://localhost:5173','http://job-tracker-ui.s3-website.us-east-2.amazonaws.com'],
  credentials: true
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/documents', documentRoutes);


export default app;
