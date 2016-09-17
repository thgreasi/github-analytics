import { mockUserData, mockUserOrgsData, mockRepoData } from './GithubServiceMockData';

export class GithubService {
	static getUserInfo (username) {
        return Promise.resolve(mockUserData[username]);
    }

    static getUserOrgs (username) {
        return Promise.resolve(mockUserOrgsData[username] || []);
    }

    static getUserRepos (username) {
        return Promise.resolve(mockRepoData[username] || []);
    }

    static getRepoDetails (username, reponame) {
        return this.getUserRepos(username)
        	.then(repos => {
        		var result = repos.filter(r => r.name === reponame).shift();
                if (result) {
                    var sign = Math.random() >= 0.5 ? 1 : -1;
                    result.stargazers_count = Math.max(0,
                        result.stargazers_count + Math.ceil(sign * Math.random() * 0.3 * result.stargazers_count));
                }
                return result;
        	});
    }
}
