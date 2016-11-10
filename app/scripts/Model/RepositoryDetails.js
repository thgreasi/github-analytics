import { GithubService } from '../Services/GithubServiceMock';
import { NpmService } from '../Services/NpmServiceMock';

export default class RepositoryDetails {

    constructor () {
        this.stargazersHistory = this.stargazersHistory || [];
        this.downloadsHistory = this.downloadsHistory || [];
    }

    setStargazers (value) {
        if (value !== +value) {
            return;
        }

        var date = new Date();
        this.stargazersHistory = this.stargazersHistory || [];
        if (!this.stargazersHistory.length || this.stargazers_count !== value) {
            this.stargazersHistory.push({
                date: date,
                value: value
            });
        }

        if (this.stargazers_count !== value) {
            this.stargazers_count = value;
            this.stargazers_count_lastUpdateDate = date;
        }
    }

    updateDetails () {
        return GithubService.getRepoDetails(this.owner.login, this.name).then(repo => {
            this.setStargazers(repo.stargazers_count);
            Object.keys(repo).filter(k =>
                typeof repo[k] !== 'function' &&
                k !== 'stargazersHistory' &&
                k !== 'downloadsHistory'
            ).forEach(k => {
                this[k] = repo[k];
            });
            return repo;
        });
    }

    setDownloads (value) {
        if (value !== +value) {
            return;
        }

        var date = new Date();
        this.downloadsHistory = this.downloadsHistory || [];
        if (!this.downloadsHistory.length || this.downloads !== value) {
            this.downloadsHistory.push({
                date: this.downloads_lastUpdateDate,
                value: value
            });
        }

        if (this.downloads !== value) {
            this.downloads = value;
            this.downloads_lastUpdateDate = date;
        }
    }

    updateDownloads () {
        if (this.fork) {
            // TODO: actually check the NPM package target
            return Promise.resolve(0);
        }
        this.downloads_lastRequestDate = new Date();
        return NpmService.getDownloadCountsLastMonth(this.name).then(dls => {
            this.setDownloads(dls.downloads);
            return dls;
        });
    }
}
