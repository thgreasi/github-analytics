import $ from 'jquery';
import Rx from 'Rx';

import RepositoryDetails from './RepositoryDetails';

const BASE_URL = 'https://api.github.com/';

export class GithubService {

    static getUserInfo (username) {
        var promise = $.get(BASE_URL + `users/${username}`);
        // return promise;
        return Promise.resolve(promise).catch(function (err) {
            console.log(err);
            return err;
        });
    }

    static getUserOrgs (username) {
        var promise = $.get(BASE_URL + `users/${username}/orgs`);
        // return promise;
        return Promise.resolve(promise).catch(function (err) {
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
            }).map(repo => Object.assign(new RepositoryDetails(), repo));
        }).catch(function (err) {
            console.log(err);
            return err;
        });
    }

    static getRepoDetails (username, reponame) {
        var promise = Promise.resolve($.get(BASE_URL + `repos/${username}/${reponame}`))
            .then(repo => Object.assign(new RepositoryDetails(), repo));
        // the only extras are: network_count & subscribers_count
        return Promise.resolve(promise).catch(function (err) {
            console.log(err);
            return err;
        });
    }

    static searchUser (username) {
        // https://api.github.com/search/users?q=thgre
        var promise = $.get(BASE_URL + `search/users?q=${username}`);
        // the only extras are: network_count & subscribers_count
        return Promise.resolve(promise).catch(function (err) {
            console.log(err);
            return err;
        });
    }

    // TODO: add TopN parameter
    static searchRepo (reponame) {
        // https://api.github.com/search/repositories?q=localfora
        var promise = $.get(BASE_URL + `search/repositories?q=${reponame}`)
            .then(result => {
                result.items = result.items.map(repo => Object.assign(new RepositoryDetails(), repo));
                return result;
            });
        // the only extras are: network_count & subscribers_count
        return Promise.resolve(promise).catch(function (err) {
            console.log(err);
            return err;
        });
    }
}
