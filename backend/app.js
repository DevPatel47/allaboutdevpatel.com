import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS with credentials and allowed origin from environment variable
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000", // React dev server default port
    credentials: true
}));

// Parse incoming JSON and URL-encoded data with size limits
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// Import your API route modules here



// Register API routes with versioned prefixes



// Serve React build folder for production
const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

// Catch-all handler for SPA: serve index.html for any unknown route (except API)
app.get('*name', (req, res) => {
    // If request starts with /api, pass to next middleware (or 404)
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'API route not found' });
    }
    // Otherwise serve React's index.html
    res.sendFile(path.join(buildPath, 'index.html'));
});

export { app };
