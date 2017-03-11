export default class RepositoryDetails {

    constructor () {
        this.stargazersHistory = [];
        this.downloadsHistory = [];
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

    setStargazers (value, setPathFn) {
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

    updateDetails (setPathFn) {
        var GithubService = document.createElement('iron-meta').byKey('GithubService');
        // return GithubService.getRepoDetails(this.owner.login, this.name).then(data => {
        return GithubService.getRepoDetailsByFullName(this.full_name).then(data => {
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
    
    // updateDetails (setPathFn) {
    //     var searchProvider = document.createElement('iron-meta').byKey('WeatherService');
    //     return searchProvider.getCityWeatherByID(this.id).then(data => {
    //         console.log('asdf', data);
    //         if (!data || !data.id) {
    //             return;
    //         }
    //         Object.keys(data).forEach(key => {
    //             var newProp = data[key];
    //             if (this[key] !== newProp) {
    //                 // this.set(`items.#${index}.${key}`, newProp);
    //                 if (typeof setPathFn === 'function') {
    //                     setPathFn(`.${key}`, newProp);
    //                 } else {
    //                     this[key] = newProp;
    //                 }
    //             }
    //         });
    //         return data;
    //     });
    // }

    setDownloads (value, setPathFn) {
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

    updateDownloads (setPathFn) {
        if (this.fork) {
            // TODO: actually check the NPM package target
            return Promise.resolve(0);
        }
        this.downloads_lastRequestDate = new Date();
        var NpmService = document.createElement('iron-meta').byKey('NpmService');
        return NpmService.getDownloadCountsLastMonth(this.name).then(dls => {
            this.setDownloads(dls.downloads, setPathFn);
            return dls;
        });
    }
}
