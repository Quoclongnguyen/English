import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import authRouter from './routes/auth';
import onboardingRouter from './routes/onboarding';
import wordsRouter from './routes/words';
import usersRouter from './routes/users';
import listeningRouter from './routes/listening';
import readingRouter from './routes/reading';
import grammarRouter from './routes/grammar';
import { startStreakFreezeJob } from './jobs/streakFreezeJob';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.get('/', (_req, res) => {
  res.json({ message: 'LEXIS English API is running!', version: '1.0.0' });
});

app.use('/api/auth', authRouter);
app.use('/api/onboarding', onboardingRouter);
app.use('/api/words', wordsRouter);
app.use('/api/users', usersRouter);
app.use('/api/listening', listeningRouter);
app.use('/api/reading', readingRouter);
app.use('/api/grammar', grammarRouter);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Server
const startServer = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI as string;
    if (!mongoUri || mongoUri.includes('<username>')) {
      console.warn(' MONGODB_URI not set — running without database');
    } else {
      await mongoose.connect(mongoUri);
      console.log(' Connected to MongoDB Atlas');
    }

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      // Start the background streak freeze auto-protect cron job
      startStreakFreezeJob();
    });
  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
