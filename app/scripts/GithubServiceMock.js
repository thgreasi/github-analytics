import { mockUserData, mockUserOrgsData, mockRepoData } from './GithubServiceMockData';

export class GithubService {
	getUserInfo (username) {
        return Promise.resolve(mockUserData[username]);
    }

    getUserOrgs (username) {
        return Promise.resolve(mockUserOrgsData[username] || []);
    }

    getUserRepos (username) {
        return Promise.resolve(mockRepoData[username] || []);
    }

    getRepoDetails (username, reponame) {
        return this.getUserRepos(username)
        	.then(repos => {
        		return repos.filter(r => r.name === reponame).shift();
        	});
    }
}
