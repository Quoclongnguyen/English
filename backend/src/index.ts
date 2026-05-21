import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('LEXIS English API is running!');
});

const startServer = async () => {
  try {
    // Uncomment when MongoDB URI is set in .env
    // await mongoose.connect(process.env.MONGODB_URI as string);
    // console.log('Connected to MongoDB');
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
