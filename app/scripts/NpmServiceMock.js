import $ from 'jquery';
import Rx from 'Rx';

export class NpmServiceMock {
    constructor () {
        this.baseUrl = 'https://api.npmjs.org/';
    }

    getDownloadCountsLastMonth (packageName) {
        // https://api.npmjs.org/downloads/point/last-month/jquery
        return Promise.resolve({"downloads":2072243,"start":"2016-06-16","end":"2016-07-15","package":"jquery"});
    }

    getDistTags (packageName) {
        // http://registry.npmjs.org/-/package/babel-core/dist-tags
        return Promise.resolve({"latest":"6.10.4","old":"5.8.38"});
    }
}
