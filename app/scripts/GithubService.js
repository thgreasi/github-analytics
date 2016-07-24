import $ from 'jquery';
import Rx from 'Rx';

export class GithubService {
    constructor () {
        this.baseUrl = 'https://api.github.com/';
    }

    getUserRepos (username) {
        var promise = $.get(this.baseUrl + `users/${username}/repos`);
        // return promise;
        return promise.then(function (repos) {
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
        }).then(null, function (err) {
            console.log(err);
        });
    }

    getRepoDetails (username, reponame) {
        var promise = $.get(this.baseUrl + `repos/${username}/${reponame}`);
        // the only extras are: network_count & subscribers_count
        return promise.then(function (repo) {
            console.log(repo);
        }).then(null, function (err) {
            console.log(err);
        });
    }
}
