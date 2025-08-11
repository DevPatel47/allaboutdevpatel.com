const GitHubService = {
    async getUser(username) {
        const res = await fetch(`/api/v1/github/${username}`);
        if (!res.ok) throw new Error('Failed to load GitHub profile');
        const json = await res.json();
        return json?.data?.profile || json?.profile || json;
    },
};
export default GitHubService;
