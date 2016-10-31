import $ from 'jquery';
import Rx from 'Rx';

export class NpmService {
    static getDownloadCountsLastMonth (packageName) {
        var promise = $.get(`https://api.npmjs.org/downloads/point/last-month/${packageName}`);
        // return promise;
        return Promise.resolve(promise).catch(function (err) {
            console.log(err);
            return err;
        });
    }

    // static getDistTags (packageName) {
    //     var promise = $.get(`http://registry.npmjs.org/-/package/${packageName}/dist-tags`);
    //     // return promise;
    //     return promise.catch(null, function (err) {
    //         console.log(err);
    //     });
    // }

    static searchNpm (packageName) {
        return fetch(`http://npmsearch.com/query?q=${packageName}&fields=name`).then(function (response) {
            return response.json();
        }).catch(null, function (err) {
            console.log(err);
            return err;
        });
    }
}
