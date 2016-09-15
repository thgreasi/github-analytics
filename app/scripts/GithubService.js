import $ from 'jquery';
import Rx from 'Rx';

const BASE_URL = 'https://api.github.com/';

export class GithubService {
    static getUserInfo (username) {
        var promise = $.get(BASE_URL + `users/${username}`);
        // return promise;
        return Promise.resolve(promise).then(function(data) {
            console.log(data);
            return data;
        }).then(null, function (err) {
            console.log(err);
            return err;
        });
    }

    static getUserOrgs (username) {
        var promise = $.get(BASE_URL + `users/${username}/orgs`);
        // return promise;
        return Promise.resolve(promise).then(function(data) {
            console.log(data);
            return data;
        }).then(null, function (err) {
            console.log(err);
            return err;
        });
    }

    static getUserRepos (username) {
        var promise = $.get(BASE_URL + `users/${username}/repos`);
        // return promise;
        return Promise.resolve(promise).then(function (repos) {
            return repos.map(function (repo) {
                return {
                    id: repo.id,
                    name: repo.name,
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
            });
        }).then(function(data) {
            console.log(data);
            return data;
        }).then(null, function (err) {
            console.log(err);
            return err;
        });
    }

    static getRepoDetails (username, reponame) {
        var promise = $.get(BASE_URL + `repos/${username}/${reponame}`);
        // the only extras are: network_count & subscribers_count
        return Promise.resolve(promise).then(function (repo) {
            console.log(repo);
            return repo;
        }).then(null, function (err) {
            console.log(err);
            return err;
        });
    }
}
