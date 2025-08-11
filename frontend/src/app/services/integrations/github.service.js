const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const HOST = `${BASE_URL}/github`;

function GitHubService() {
    this.host = HOST;
}

/**
 * Get GitHub user profile (proxied by backend).
 * @param {string} username
 * @returns {Promise<object>}
 */
GitHubService.prototype.getUser = async function (username) {
    if (!username) throw new Error('Username required');
    const res = await fetch(`${this.host}/${username}`, {
        method: 'GET',
        credentials: 'include',
    });
    const json = await res.json();
    if (!res.ok) {
        throw new Error(json.message || 'Failed to load GitHub profile');
    }
    return json?.data?.profile || json?.profile || json;
};

export default new GitHubService();
