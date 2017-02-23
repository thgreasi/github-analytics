'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'search-github-page',

    properties: {
      searchTermUnDebounced: {
        type: String,
        observer: '_searchTermUnDebouncedChangedObserver'
      },

      searchTerm: {
        type: String,
        // value: 'Welcome!',
        notify: true
      },

      searchTermTmp: {
        type: String,
        // value: 'Welcome!',
        notify: false
      },

      searchProvider: {
        type: Object,
        default: function _default(f) {
          return {
            searchUser: function searchUser() {
              return null;
            }
          };
        },
        notify: true
      },

      savedRepos: {
        type: Array,
        notify: true
      }
    },

    _searchTermUnDebouncedChangedObserver: function _searchTermUnDebouncedChangedObserver(newValue) {
      var _this = this;

      this.debounce('searchTermChanged', function () {
        _this.set('searchTerm', newValue);
      }, 1000);
    },

    setSearchTerm: function setSearchTerm() {
      this.set('searchTerm', this.searchTermTmp || '');
    },

    ready: function ready() {
      var _this2 = this;

      this.$.searchForm.addEventListener('iron-form-presubmit', function (event) {
        event.preventDefault();
        _this2.setSearchTerm();
      });

      // we should use the promise returned by LF if the polymer package gets ever updated
      var lastValueLoadedFn = function lastValueLoadedFn() {
        if (_this2.searchTermTmp === undefined && _this2.searchTerm !== undefined) {
          _this2.$.lastSearchTermStorage.removeEventListener('value-changed', lastValueLoadedFn);
          _this2.set('searchTermTmp', _this2.searchTerm || '');
          _this2.$.searchInput.value = _this2.searchTermTmp;
        }
      };
      this.$.lastSearchTermStorage.addEventListener('value-changed', lastValueLoadedFn);

      this.$.lastSearchTermStorage.load();
    }
  });
})();