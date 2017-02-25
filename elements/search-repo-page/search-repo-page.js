'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'search-repo-page',

    properties: {
      repoNamesParam: {
        type: String,
        notify: true,
        observer: '_repoNamesParamChanged'
      },

      repoNames: {
        type: Array,
        notify: true
      },

      repos: {
        type: Array,
        notify: true
      }
    },

    _repoNamesParamChanged: function _repoNamesParamChanged() {
      if (!this.repoNamesParam || !this.repoNamesParam.length) {
        this.repoNames = [];
      } else {
        this.repoNames = this.repoNamesParam.split(',').map(function (s) {
          return s.trim();
        }).filter(function (s) {
          return s && s.length;
        });
      }
    },

    ready: function ready() {}
  });
})();