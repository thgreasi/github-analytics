'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'show-repos-page',

    properties: {
      repoNamesParam: {
        type: String,
        notify: true,
        observer: '_repoNamesParamChanged'
      },

      searchProvider: {
        type: Object,
        default: function _default(f) {
          return {
            getRepoDetails: function getRepoDetails() {
              return null;
            }
          };
        },
        notify: true
      },

      repoNames: {
        type: Array,
        notify: true
      },

      repoFullDetails: {
        type: Array,
        notify: true
      }
    },

    _repoNamesParamChanged: function _repoNamesParamChanged() {
      var _this = this;

      if (!this.repoNamesParam || !this.repoNamesParam.length) {
        this.repoNames = [];
      } else {
        this.repoNames = this.repoNamesParam.split(',').map(function (s) {
          return s.trim();
        }).filter(function (s) {
          return s && s.length;
        });
      }
      this.notifyPath('repoNames', this.repoNames);

      this.repoFullDetails = this.repoNames.map(function (name) {
        var result = {
          name: name
        };
        _this.searchProvider.searchRepo(name).then(function (repos) {
          return repos.items.filter(function (item) {
            return item.name === name;
          })[0];
        }).then(function (repo) {
          var i = _this.repoFullDetails.indexOf(result);
          if (i >= 0 && repo) {
            _this.repoFullDetails[i] = repo;
            _this.set('repoFullDetails.#' + i, repo);
          }
        });
        return result;
      });
    },

    ready: function ready() {}
  });
})();