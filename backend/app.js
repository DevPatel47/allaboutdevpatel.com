import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { swaggerUi, swaggerSpec } from './config/swagger.js';
import { verifyJWT } from './middlewares/auth.middleware.js';

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
import userRouter from './routes/user.routes.js';
// import introductionRouter from './routes/introduction.routes.js';
// import educationRouter from './routes/education.routes.js';
// import experienceRouter from './routes/experience.routes.js';
// import skillRouter from './routes/skill.routes.js';
// import projectRouter from './routes/project.routes.js';
// import contactRouter from './routes/contact.routes.js';
// import testimonialRouter from './routes/testimonial.routes.js';
// import certificationRouter from './routes/certification.routes.js';
// import socialLinkRouter from './routes/sociallink.routes.js';
// import siteSettingRouter from './routes/sitesetting.routes.js';
// import blogPostRouter from './routes/blogpost.routes.js';
// import notificationRouter from './routes/notification.routes.js';
// import activityLogRouter from './routes/activitylog.routes.js';

// Register API routes with versioned prefixes
app.use('/api/v1/users', userRouter);
// app.use('/api/v1/introductions', introductionRouter);
// app.use('/api/v1/educations', educationRouter);
// app.use('/api/v1/experiences', experienceRouter);
// app.use('/api/v1/skills', skillRouter);
// app.use('/api/v1/projects', projectRouter);
// app.use('/api/v1/contacts', contactRouter);
// app.use('/api/v1/testimonials', testimonialRouter);
// app.use('/api/v1/certifications', certificationRouter);
// app.use('/api/v1/social-links', socialLinkRouter);
// app.use('/api/v1/site-settings', siteSettingRouter);
// app.use('/api/v1/blog-posts', blogPostRouter);
// app.use('/api/v1/notifications', notificationRouter);
// app.use('/api/v1/activity-logs', activityLogRouter);

// Serve React build folder for production
const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

// Serve Swagger UI documentation
app.use('/api-docs', verifyJWT, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
