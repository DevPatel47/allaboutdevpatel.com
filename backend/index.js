import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';

// Load environment variables from .env file
dotenv.config({
    path: "./.env"
});

// Establish database connection and start the server
connectDB()
    .then(() => {
        // Start Express server on specified port
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        // Handle MongoDB connection errors
        console.log("MongoDB connection error: ", err);
    });