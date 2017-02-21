import RepositoryDetails from '../Model/RepositoryDetails';

import { mockUserData } from './MockData/GithubServiceMockUserData';
import { mockUserOrgsData } from './MockData/GithubServiceMockUserOrgsData';
import { mockRepoData } from './MockData/GithubServiceMockRepoData';
import { mockUserSearchData } from './MockData/GithubServiceMockUserSearchData';
import { mockRepoSearchData } from './MockData/GithubServiceMockRepoSearchData';

export class GithubService {

    static getUserInfo (username) {
        return Promise.resolve(mockUserData[username]);
    }

    static getUserOrgs (username) {
        return Promise.resolve(mockUserOrgsData[username] || []);
    }

    static getUserRepos (username) {
        return Promise.resolve((mockRepoData[username] || [])
            .map(repo => Object.assign(new RepositoryDetails(), repo)));
    }

    static getRepoDetails (username, reponame) {
        return this.getUserRepos(username)
            .then(repos => {
                var result = repos.filter(r => r.name === reponame).shift();
                if (result) {
                    // result = Object.assign(new RepositoryDetails(), result);
                    var sign = Math.random() >= 0.5 ? 1 : -1;
                    result.stargazers_count = Math.max(0,
                        result.stargazers_count + Math.ceil(sign * Math.random() * 0.3 * result.stargazers_count));
                }
                return result;
            });
    }

    static searchUser (username) {
        return new Promise((resolve) => {
            var match = mockUserSearchData[username];
            if (match) {
                setTimeout(() => {
                    resolve(match);
                }, 1000 + Math.random() * 2);
            } else {
                let match = mockUserSearchData.thgre;
                if (username && match) {
                    var result = Object.assign({}, match);
                    result.items = result.items.filter(i => {
                        return i.login.indexOf(username) >= 0;
                    });
                    setTimeout(() => {
                        resolve(result);
                    }, 1000 + Math.random() * 1);
                } else {
                    resolve({});
                }
            }
        });
    }

    static searchRepo (reponame) {
        return new Promise((resolve) => {
            var match = mockRepoSearchData[reponame];
            if (match) {
                setTimeout(() => {
                    resolve(match);
                }, 1000 + Math.random() * 2);
            } else {
                let match = mockRepoSearchData.localfora;
                if (reponame && match) {
                    var result = Object.assign({}, match);
                    result.items = result.items.filter(i => {
                        return i.name.indexOf(reponame) >= 0;
                    }).map(repo => Object.assign(new RepositoryDetails(), repo));
                    setTimeout(() => {
                        resolve(result);
                    }, 1000 + Math.random() * 1);
                } else {
                    resolve({});
                }
            }
        });
    }
}
