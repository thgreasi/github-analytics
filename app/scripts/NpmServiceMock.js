import $ from 'jquery';
import Rx from 'Rx';

export class NpmService {
    static getDownloadCountsLastMonth (packageName) {
        // https://api.npmjs.org/downloads/point/last-month/jquery
        return Promise.resolve({
            "downloads": packageName.length % 7 ?
                            (2072243 * Math.random()) | 0 :
                            undefined,
            "start": "2016-06-16",
            "end": "2016-07-15",
            "package": packageName
        });
    }

    // static getDistTags (packageName) {
    //     // http://registry.npmjs.org/-/package/babel-core/dist-tags
    //     return Promise.resolve({"latest":"6.10.4","old":"5.8.38"});
    // }
}
