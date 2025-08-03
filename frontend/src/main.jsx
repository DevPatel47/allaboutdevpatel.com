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
} from './app/components/index.js';

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

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
