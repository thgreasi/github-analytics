import { GithubService } from './GithubServiceMock';
import { NpmService } from './NpmServiceMock';

export default class RepositoryDetails {
    updateDetails () {
        this.repoDetails_lastRequestDate = new Date();
        return GithubService.getRepoDetails(this.owner.login, this.name).then(repo => {
            // this.repoDetails_lastUpdateDate = new Date();
            if (this.stargazers_count !== repo.stargazers_count) {
                // this.stargazers_count_diff = repo.stargazers_count - (this.stargazers_count || 0);

                this.stargazers_count = repo.stargazers_count;
                this.stargazers_count_lastUpdateDate = new Date();

                this.stargazersHistory = this.stargazersHistory || [];
                this.stargazersHistory.push({
                    date: this.stargazers_count_lastUpdateDate,
                    value: repo.stargazers_count
                });
            }
            Object.assign(this, repo);
            return repo;
        });
    }

    getDownloads () {
        this.downloads_lastRequestDate = new Date();
        return NpmService.getDownloadCountsLastMonth(this.name).then(dls => {
            if (this.downloads !== dls.downloads) {
                // this.downloads_diff = dls.downloads - (this.downloads || 0);

                this.downloads = dls.downloads;
                this.downloads_lastUpdateDate = new Date();

                this.downloadsHistory = this.downloadsHistory || [];
                this.downloadsHistory.push({
                    date: this.downloads_lastUpdateDate,
                    value: dls.downloads
                });
            }
            return dls;
        });
    }
}
