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
        		return repos.filter(r => r.name === reponame).shift();
        	});
    }
}
