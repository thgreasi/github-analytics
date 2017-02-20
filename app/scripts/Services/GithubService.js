import Rx from 'Rx';

import RepositoryDetails from '../Model/RepositoryDetails';

const BASE_URL = 'https://api.github.com/';

export class GithubService {

    static getUserInfo (username) {
        return fetch(BASE_URL + `users/${username}`).then(function (response) {
            return response.json();
        }).catch(function (err) {
            console.log(err);
            return err;
        });
    }

    static getUserOrgs (username) {
        return fetch(BASE_URL + `users/${username}/orgs`).then(function (response) {
            return response.json();
        }).catch(function (err) {
            console.log(err);
            return err;
        });
    }

    static getUserRepos (username) {
        return fetch(BASE_URL + `users/${username}/repos`).then(function (response) {
            return response.json();
        }).then(function (repos) {
            return repos.map(function (repo) {
                return {
                    id: repo.id,
                    name: repo.name,
                    owner: repo.ownder,
                    full_name: repo.full_name,
                    description: repo.description,
                    fork: repo.fork,
                    html_url: repo.html_url,
                    url: repo.url,
                    tags_url: repo.tags_url,
                    stargazers_count: repo.stargazers_count,
                    watchers_count: repo.watchers_count
                };
            }).filter(function (repo) {
                return !repo.fork;
            }).map(repo => Object.assign(new RepositoryDetails(), repo));
        }).catch(function (err) {
            console.log(err);
            return err;
        });
    }

    static getRepoDetails (username, reponame) {
        return fetch(BASE_URL + `repos/${username}/${reponame}`).then(function (response) {
            return response.json();
        }).then(repo => {
            // the only extras are: network_count & subscribers_count
            return Object.assign(new RepositoryDetails(), repo);
        }).catch(function (err) {
            console.log(err);
            return err;
        });
    }

    // https://developer.github.com/v3/search/#search-users
    // file:///home/teo/Drive/Dev/githubAnalytics/research/docs/Search%20|%20GitHub%20Developer%20Guide.html#search-users
    static searchUser (username) {
        // https://api.github.com/search/users?q=thgre
        return fetch(BASE_URL + `search/users?q=${username}`).then(function (response) {
            return response.json();
        }).catch(function (err) {
            console.log(err);
            return err;
        });
    }

    // TODO: add TopN parameter
    // https://developer.github.com/v3/search/#search-repositories
    // file:///home/teo/Drive/Dev/githubAnalytics/research/docs/Search%20|%20GitHub%20Developer%20Guide.html#search-repositories
    static searchRepo (reponame) {
        // https://api.github.com/search/repositories?q=localfora
        return fetch(BASE_URL + `search/repositories?q=${reponame}`).then(function (response) {
            var result = response.json();
            return result;
        }).then(result => {
            result.items = result.items.map(repo => Object.assign(new RepositoryDetails(), repo));
            return result;
        }).catch(function (err) {
            console.log(err);
            return err;
        });
    }
}
