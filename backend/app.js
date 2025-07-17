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
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // React dev server default port
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
// import skillRouter from './routes/portfolio/skill.routes.js';
// import projectRouter from './routes/portfolio/project.routes.js';
// import contactRouter from './routes/portfolio/contact.routes.js';
// import testimonialRouter from './routes/portfolio/testimonial.routes.js';
// import certificationRouter from './routes/portfolio/certification.routes.js';
// import socialLinkRouter from './routes/portfolio/sociallink.routes.js';
// import siteSettingRouter from './routes/portfolio/sitesetting.routes.js';

// Register API routes with versioned prefixes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/portfolio/introductions', introductionRouter);
app.use('/api/v1/portfolio/educations', educationRouter);
app.use('/api/v1/portfolio/experiences', experienceRouter);
// app.use('/api/v1/portfolio/skills', skillRouter);
// app.use('/api/v1/portfolio/projects', projectRouter);
// app.use('/api/v1/portfolio/contacts', contactRouter);
// app.use('/api/v1/portfolio/testimonials', testimonialRouter);
// app.use('/api/v1/portfolio/certifications', certificationRouter);
// app.use('/api/v1/portfolio/social-links', socialLinkRouter);
// app.use('/api/v1/site-settings', siteSettingRouter);

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
