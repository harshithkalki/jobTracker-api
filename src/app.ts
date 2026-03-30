import express from 'express';
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';

const app=express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);


export default app;
