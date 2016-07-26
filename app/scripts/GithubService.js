import $ from 'jquery';
import Rx from 'Rx';

export class GithubService {
    constructor () {
        this.baseUrl = 'https://api.github.com/';
    }

    getUserInfo (username) {
        var promise = $.get(this.baseUrl + `users/${username}`);
        // return promise;
        return Promise.resolve(promise).then(function(data) {
            console.log(data);
            return data;
        }).then(null, function (err) {
            console.log(err);
            return err;
        });
    }

    getUserOrgs (username) {
        var promise = $.get(this.baseUrl + `users/${username}/orgs`);
        // return promise;
        return Promise.resolve(promise).then(function(data) {
            console.log(data);
            return data;
        }).then(null, function (err) {
            console.log(err);
            return err;
        });
    }

    getUserRepos (username) {
        var promise = $.get(this.baseUrl + `users/${username}/repos`);
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

    getRepoDetails (username, reponame) {
        var promise = $.get(this.baseUrl + `repos/${username}/${reponame}`);
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
