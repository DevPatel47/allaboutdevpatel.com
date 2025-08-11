/**
 * Home Component
 *
 * Fetches and displays the user's portfolio, including introduction, about, and education.
 * Handles loading and error states gracefully.
 *
 * @module Home
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PortfolioService from '../services/portfolio/portfolio.service.js';
import {
    Introduction,
    AboutMe,
    Education,
    Certifications,
    Skills,
    Projects,
    ContactMe,
    Testimonials,
} from '../components/components.js';

import { Error, Loading } from './pages.js';

/**
 * Home component for the main landing page.
 * @returns {JSX.Element}
 */
function Home() {
    const { username } = useParams();

    const [portfolio, setPortfolio] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                setLoading(true);
                let data;
                if (username) {
                    data = await PortfolioService.getByUsername(username);
                } else {
                    data = await PortfolioService.getByUsername('devpatel47');
                }
                if (isMounted) {
                    setPortfolio(data?.portfolio || data);
                    setError(false);
                }
            } catch (err) {
                if (isMounted) setError(true);
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => {
            isMounted = false;
        };
    }, [username]);

    if (error) {
        return (
            <Error errorMessage="Something went wrong while loading portfolio, please try again later." />
        );
    }

    if (loading) {
        return <Loading loadingMessage="Loading portfolio..." />;
    }

    return (
        <>
            <Introduction
                introduction={portfolio?.introduction}
                socialLinks={portfolio?.socialLinks}
            />
            <AboutMe description={portfolio?.introduction?.description} />
            <Education education={portfolio?.education} />
            <Skills skills={portfolio?.skills} />
            <Certifications certifications={portfolio?.certifications} />
            <Projects projects={portfolio?.projects} />
            <Testimonials testimonials={portfolio?.testimonials} userId={portfolio?.user?._id} />
            <ContactMe />
        </>
    );
}

export default Home;
