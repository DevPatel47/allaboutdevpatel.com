import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PortfolioService from '../services/portfolio/portfolio.service.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as brands from '@fortawesome/free-brands-svg-icons';
import { MagnetBtn } from './index.js';

// Helper to get the icon definition from the icon string (e.g. "faGithub")
function getBrandIcon(iconName) {
    // iconName should be like "faGithub", "faLinkedin", etc.
    return brands[iconName] || null;
}

function Home() {
    const { username } = useParams();

    const [portfolio, setPortfolio] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                let data;
                if (username) {
                    data = await PortfolioService.getByUsername(username);
                } else {
                    data = await PortfolioService.getByUsername('devpatel47');
                }
                // If API returns { data: { portfolio: {...} } }
                setPortfolio(data?.portfolio || data);
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false);
            }
        })();
    }, [username]);

    if (error) {
        return (
            <h1 className="text-2xl md:text-6xl font-bold text-blue-300 text-center px-4 py-8">
                Something went wrong while loading portfolio, please try again later.
            </h1>
        );
    }

    if (loading) {
        return (
            <h1 className="text-2xl md:text-6xl font-bold text-blue-300 text-center px-4 py-8">
                Loading...
            </h1>
        );
    }

    const socialLinks = portfolio?.socialLinks || [];

    return (
        <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-6xl mx-auto px-4 py-8 gap-8">
            <div className="w-full md:w-1/3 flex justify-center">
                <img
                    src={portfolio ? portfolio.introduction.profileImage : ''}
                    alt={
                        portfolio
                            ? `${portfolio.introduction.name}'s Profile Picture`
                            : "Dev Patel's Profile Picture"
                    }
                    className="rounded-2xl shadow-lg w-48 h-64 md:w-72 md:h-96 object-cover"
                />
            </div>
            <div className="w-full md:w-2/3 flex flex-col items-center md:items-start text-center md:text-left">
                <h1 className="text-3xl md:text-6xl font-bold text-blue-50 mb-4">
                    {portfolio ? portfolio.introduction.greeting : 'Hi'}, I am{' '}
                    <span className="text-blue-600">
                        {portfolio ? portfolio.introduction.name : 'Dev Patel'}
                    </span>
                </h1>
                {portfolio && (
                    <h2 className="text-lg md:text-2xl font-bold text-blue-50">
                        {portfolio.introduction.tagline}
                    </h2>
                )}
                <p className="text-gray-300 mt-4 font-roboto text-lg md:text-2xl">
                    {portfolio ? portfolio.introduction.description : ''}
                </p>
                {/* Social Links */}
                {socialLinks.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
                        {socialLinks.map((link) => {
                            const icon = link.icon && getBrandIcon(link.icon);
                            return (
                                <a
                                    key={link._id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={
                                        icon
                                            ? 'text-blue-50 hover:text-blue-600 transition duration-200 text-4xl transform hover:scale-125 hover:drop-shadow-md hover:shadow-blue-600'
                                            : 'bg-blue-50 text-blue-50/1 hover:bg-blue-600 hover:text-white hover:scale-125 transition hover:shadow-md hover:shadow-blue-600 duration-200 font-bold rounded-full px-4 py-2'
                                    }
                                >
                                    {icon ? (
                                        <FontAwesomeIcon icon={icon} />
                                    ) : (
                                        <span>{link.platform}</span>
                                    )}
                                </a>
                            );
                        })}
                    </div>
                )}
                <div className="mt-6 flex flex-wrap gap-6 justify-center md:justify-start">
                    <a
                        className="text-blue-50 hover:text-blue-600 transition duration-200 text-lg md:text-2xl font-semibold"
                        href={`${portfolio ? portfolio.introduction.resume : ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View My Resume
                    </a>
                    <MagnetBtn padding={50} disabled={false} magnetStrength={2}>
                        <a
                        className="text-blue-50 hover:text-blue-600 transition duration-200 text-lg md:text-2xl font-semibold"
                        href={`mailto:${portfolio ? portfolio.introduction.email : ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Hire Me
                    </a>
                    </MagnetBtn>
                </div>
            </div>
        </div>
    );
}

export default Home;
