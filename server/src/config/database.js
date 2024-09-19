import mongoose from 'mongoose';
import {} from './config'
const paymentData = require('./credentials');

const connectDB = async () =>{
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB SERVER ${conn.connection.host}')
  } catch (error) {

  }
}


