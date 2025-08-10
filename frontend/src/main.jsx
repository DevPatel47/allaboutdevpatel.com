/**
 * Main entry point for the React application.
 * Sets up routing and renders the root component.
 * @module main
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from 'react-router-dom';

import './style/Index.css';

// Components
import {
    Layout,
    Home,
    Projects,
    Github,
    Admin,
    Login,
    Register,
    ProjectDetails,
} from './app/pages/pages.js';

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Base route for anonymous users */}
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/:slug" element={<ProjectDetails />} />
                <Route path="github" element={<Github />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="admin" element={<Admin />} />
            </Route>

            {/* Route for logged-in or public user profile pages */}
            <Route path="/:username" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="projects" element={<Projects />} />
                <Route path="github" element={<Github />} />
                <Route path="projects/:slug" element={<ProjectDetails />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>
        </>,
    ),
);

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Root element with id "root" not found.');
}

createRoot(rootElement).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
