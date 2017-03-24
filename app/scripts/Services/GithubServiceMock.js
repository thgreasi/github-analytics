import RepositoryDetails from '../Model/RepositoryDetails';

import { mockUserData } from './MockData/GithubServiceMockUserData';
import { mockUserOrgsData } from './MockData/GithubServiceMockUserOrgsData';
import { mockRepoData } from './MockData/GithubServiceMockRepoData';
import { mockRepoContentData } from './MockData/GithubServiceMockRepoContentData';
import { mockUserSearchData } from './MockData/GithubServiceMockUserSearchData';
import { mockRepoSearchData } from './MockData/GithubServiceMockRepoSearchData';

import { resolveAfter } from './utils';

export class GithubService {

    static getUserInfo (username) {
        return new Promise(function(resolve) {
            setTimeout(() => {
                resolve(mockUserData[username]);
            }, 1000 + Math.random() * 250);
        });
    }

    static getUserOrgs (username) {
        return new Promise(function(resolve) {
            setTimeout(() => {
                resolve(mockUserOrgsData[username] || []);
            }, 1000 + Math.random() * 250);
        });
    }

    static getUserRepos (username) {
        return new Promise(function(resolve) {
            setTimeout(() => {
                resolve((mockRepoData[username] || []).map(repo => Object.assign(new RepositoryDetails(), repo)));
            }, 1000 + Math.random() * 250);
        });
    }

    static getRepoDetails (fullname /* OR username, reponame */) {
        fullname = arguments.length === 2 ? 
            `${arguments[0]}/${arguments[1]}` :
            fullname;

        var username = (fullname || '').split('/')[0];
        var reponame = (fullname || '').split('/')[1];
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

    // app.GithubService.getRepoContents('thgreasi/ui-sortable', 'package.json').then(function(data){ console.log(data); })
    static getRepoContents (fullname, path) {
        var userRepos = mockRepoContentData[fullname] || {};
        var result = userRepos[path] || {
            'name': 'package.json',
            'path': 'package.json',
            // 'sha': 'a52ae4c7f7f86221e667c5737c48ae08fd91dc06',
            'size': 1359,
            'url': `https://api.github.com/repos/${fullname}/contents/${path}?ref=master`,
            'html_url': `https://github.com/${fullname}/blob/master/${path}`,
            // 'git_url': `https://api.github.com/repos/${fullname}/git/blobs/a52ae4c7f7f86221e667c5737c48ae08fd91dc06`,
            'download_url': `https://raw.githubusercontent.com/${fullname}/master/${path}`,
            'type': 'file',
            'content': btoa(JSON.stringify({
                'name': fullname.split('/').pop(),
                'version': '0.15.1',
                'description': fullname + ' description',
                'repository': {
                    'type': 'git',
                    'url': `git://github.com/${fullname}.git`
                }
            })),
            'encoding': 'base64',
            '_links': {
                'self': `https://api.github.com/repos/${fullname}/contents/${path}?ref=master`,
                // 'git': `https://api.github.com/repos/${fullname}/git/blobs/a52ae4c7f7f86221e667c5737c48ae08fd91dc06`,
                'html': `https://github.com/${fullname}/blob/master/${path}`
            }
        };
        return resolveAfter(result, 1000 + Math.random() * 250);
    }

    static searchUser (username) {
        return new Promise((resolve) => {
            var match = mockUserSearchData[username];
            if (match) {
                setTimeout(() => {
                    resolve(match);
                }, 1000 + Math.random() * 500);
            } else {
                let match = mockUserSearchData.thgre;
                if (username && match) {
                    var result = Object.assign({}, match);
                    result.items = result.items.filter(i => {
                        return i.login.indexOf(username) >= 0;
                    });
                    setTimeout(() => {
                        resolve(result);
                    }, 1000 + Math.random() * 250);
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
                }, 1000 + Math.random() * 500);
            } else {
                let match = mockRepoSearchData.localfora;
                if (reponame && match) {
                    var result = Object.assign({}, match);
                    result.items = result.items.filter(i => {
                        return i.name.indexOf(reponame) >= 0;
                    }).map(repo => Object.assign(new RepositoryDetails(), repo));
                    setTimeout(() => {
                        resolve(result);
                    }, 1000 + Math.random() * 250);
                } else {
                    resolve({});
                }
            }
        });
    }
}
