import mongoose from 'mongoose';
import { app } from './app';
import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../.env` });

const start = async () => {
  console.log('Starting up...');

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Mongo URI must be defined');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (e) {
    console.log('error ', e);
  }
};

app.listen(3001, () => {
  console.log('Listening on port 3001');
});

start();
