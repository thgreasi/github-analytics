import { mockSearchData } from './MockData/NpmServiceMockSearchData';

export class NpmService {
    static getDownloadCountsLastMonth (packageName) {
        // https://api.npmjs.org/downloads/point/last-month/jquery
        return Promise.resolve({
            "downloads": packageName.length % 7 ?
                            (4000 * Math.random()) | 0 :
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

    static searchNpm (packageName) {
        var result = Object.assign({}, mockSearchData);
        result.results = result.results.filter(x => x.name[0] && x.name[0].indexOf(packageName) >= 0);
        return Promise.resolve(result);
    }
}
