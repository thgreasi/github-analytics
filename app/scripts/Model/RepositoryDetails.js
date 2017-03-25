export default class RepositoryDetails {

    constructor() {
        this.stargazersHistory = [];
        this.downloadsHistory = [];
    }

    clearData() {
        this.stargazersHistory = [];
        this.downloadsHistory = [];
        this.clearResolvedData();
        return this;
    }

    clearResolvedData() {
        this.packageType = undefined;
        this.packageName = undefined;
        this.clearSessionData();
        return this;
    }

    clearSessionData() {
        this.stargazersDiff = null;
        this.downloadsDiff = null;
        return this;
    }

    _setProp(key, value, setPathFn) {
        if (this[key] !== value) {
            if (typeof setPathFn === 'function') {
                setPathFn(`.${key}`, value);
            } else {
                this[key] = value;
            }
        }
    }

    setStargazers(value, setPathFn) {
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
            if (this.stargazersHistory.length > 1) {
                this._setProp('stargazersDiff', value - this.stargazers_count, setPathFn);
            }
            this._setProp('stargazers_count', value, setPathFn);
            this._setProp('stargazers_count_lastUpdateDate', date, setPathFn);
        }
    }

    updateDetails(setPathFn) {
        var GithubService = document.createElement('iron-meta').byKey('GithubService');
        return GithubService.getRepoDetails(this.full_name).then(data => {
            if (!data) {
                return;
            }

            this.setStargazers(data.stargazers_count, setPathFn);
            Object.keys(data).filter(key =>
                typeof data[key] !== 'function' &&
                key !== 'stargazersHistory' &&
                key !== 'downloadsHistory' &&
                key !== 'viewModelData'
            ).forEach(key => this._setProp(key, data[key], setPathFn));
            return data;
        });
    }

    setDownloads(value, setPathFn) {
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
            if (this.downloadsHistory.length > 1) {
                this._setProp('downloadsDiff', value - this.downloads, setPathFn);
            }
            this._setProp('downloads', value, setPathFn);
            this._setProp('downloads_lastUpdateDate', date, setPathFn);
        }
    }

    getPackageJsonName() {
        if (this.packageType === 'package.json' && this.packageName) {
            return Promise.resolve(this.packageName);
        }

        if (this.packageType !== false && !this.packageType) {
            var GithubService = document.createElement('iron-meta').byKey('GithubService');
            return GithubService.getRepoContents(this.full_name, 'package.json')
                .then(contentInfo => {
                    if (contentInfo && contentInfo.type === 'file') {
                        var packageJson = JSON.parse(atob(contentInfo.content));
                        return packageJson.name;
                    }
                });
        }

        return Promise.resolve();
    }

    updateDownloads(setPathFn) {
        if (this.fork) {
            return Promise.resolve();
        }

        this.downloads_lastRequestDate = new Date();
        
        var packageNamePromise = this.getPackageJsonName().then(packageName => {
            this._setProp('packageType', 'package.json', setPathFn);
            this._setProp('packageName', packageName, setPathFn);
            return packageName;
        }).catch(err => {
            console.error(err);
            this._setProp('packageType', false, setPathFn);
        });

        return packageNamePromise.then(packageName => {
            if (!packageName) {
                return;
            }

            if (this.packageType === 'package.json') {
                var NpmService = document.createElement('iron-meta').byKey('NpmService');
                return NpmService.getDownloadCountsLastMonth(packageName).then(dls => {
                    this.setDownloads(dls.downloads, setPathFn);
                    return dls;
                });
            }
        });

    }
}
