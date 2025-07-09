import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * Uses the connection string from environment variables and the database name from constants.
 * Exits the process if the connection fails.
 */
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log('MongoDB connected successfully, DB Host: ', connectionInstance.connection.host);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

export default connectDB;