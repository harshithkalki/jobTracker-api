import express from 'express';
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import documentRoutes from './routes/documents';

const app=express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/documents', documentRoutes);


export default app;
