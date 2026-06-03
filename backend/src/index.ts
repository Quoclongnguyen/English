import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouter from './routes/auth';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (_req, res) => {
  res.json({ message: 'LEXIS English API is running!', version: '1.0.0' });
});

app.use('/api/auth', authRouter);

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
    });
  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
