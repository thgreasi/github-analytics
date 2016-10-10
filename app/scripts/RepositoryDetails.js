import { GithubService } from './GithubServiceMock';
import { NpmService } from './NpmServiceMock';

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
            // this.repoDetails_lastUpdateDate = new Date();
            this.setStargazers(repo.stargazers_count);
            Object.assign(this, repo);
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

    getDownloads () {
        this.downloads_lastRequestDate = new Date();
        return NpmService.getDownloadCountsLastMonth(this.name).then(dls => {
            this.setDownloads(dls.downloads);
            return dls;
        });
    }
}
