import $ from 'jquery';
import Rx from 'Rx';

export class NpmService {
    getDownloadCountsLastMonth (packageName) {
        var promise = $.get(`https://api.npmjs.org/downloads/point/last-month/${packageName}`);
        // return promise;
        return promise.then(function(data) {
            console.log(data);
        }).then(null, function (err) {
            console.log(err);
        });
    }

    getDistTags (packageName) {
        var promise = $.get(`http://registry.npmjs.org/-/package/${packageName}/dist-tags`);
        // return promise;
        return promise.then(function(data) {
            console.log(data);
        }).then(null, function (err) {
            console.log(err);
        });
    }
}
