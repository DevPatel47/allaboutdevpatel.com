import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export const getGitHubUser = async (req, res, next) => {
    try {
        const { username } = req.params;
        if (!username) throw new ApiError(400, 'Username required');
        const ghRes = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                Accept: 'application/vnd.github+json',
                'User-Agent': 'allaboutdevpatel-portfolio',
            },
        });
        if (ghRes.status === 404) throw new ApiError(404, 'GitHub user not found');
        if (!ghRes.ok) throw new ApiError(ghRes.status, 'GitHub fetch failed');
        const data = await ghRes.json();
        return res
            .status(200)
            .json(new ApiResponse(200, 'GitHub profile fetched', { profile: data }));
    } catch (e) {
        next(e);
    }
};
