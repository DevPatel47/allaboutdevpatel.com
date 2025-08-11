import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Parse allowed origins from comma-separated env var or fallback to empty array
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
    : [];

// Enable CORS with credentials and allowed origin from environment variable
app.use(
    cors({
        origin: function (origin, callback) {
            // allow requests with no origin (like curl, Postman, mobile apps)
            if (!origin) return callback(null, true);

            if (allowedOrigins.length && !allowedOrigins.includes(origin)) {
                const msg = `The CORS policy for this site does not allow access from origin: ${origin}`;
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true,
    }),
);

// Parse incoming JSON and URL-encoded data with size limits
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// Import your API route modules here
import userRouter from './routes/common/user.routes.js';
import introductionRouter from './routes/portfolio/introduction.routes.js';
import educationRouter from './routes/portfolio/education.routes.js';
import experienceRouter from './routes/portfolio/experience.routes.js';
import skillRouter from './routes/portfolio/skill.routes.js';
import projectRouter from './routes/portfolio/project.routes.js';
import certificationRouter from './routes/portfolio/certification.routes.js';
import socialLinkRouter from './routes/portfolio/sociallink.routes.js';
import testimonialRouter from './routes/portfolio/testimonial.routes.js';
import portfolioRouter from './routes/portfolio/portfolio.routes.js';
import contactRoutes from './routes/common/contact.routes.js';
import githubRoutes from './routes/integrations/github.routes.js';

// Register API routes with versioned prefixes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/portfolio/introductions', introductionRouter);
app.use('/api/v1/portfolio/educations', educationRouter);
app.use('/api/v1/portfolio/experiences', experienceRouter);
app.use('/api/v1/portfolio/skills', skillRouter);
app.use('/api/v1/portfolio/projects', projectRouter);
app.use('/api/v1/portfolio/certifications', certificationRouter);
app.use('/api/v1/portfolio/social-links', socialLinkRouter);
app.use('/api/v1/portfolio/testimonials', testimonialRouter);
app.use('/api/v1/portfolio', portfolioRouter);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/github', githubRoutes);

// Serve React dist folder for production
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

// Serve index.html for all non-API routes
app.get('*name', (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'API route not found' });
    }
    res.sendFile(path.join(distPath, 'index.html'));
});

export { app };
