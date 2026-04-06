/** Shape returned by GET /api/github/commits */
export type GithubCommitItem = {
    sha: string;
    message: string;
    repo: string;
    url: string;
    date: string;
};
