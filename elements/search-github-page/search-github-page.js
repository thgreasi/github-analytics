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
        notify: true,
        observer: '_searchTermChangedObserver'
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

    _searchTermChangedObserver: function _searchTermChangedObserver(newValue) {
      var localforage = document.createElement('iron-meta').byKey('localforage');
      localforage.setItem('search.searchTerms.last', newValue).then(function () {
        console.log('setItem(\'search.searchTerms.last\', ' + newValue + ') Saved!');
      }).catch(function (e) {
        console.error('setItem(\'search.searchTerms.last\', ' + newValue + ') Error', e);
      });
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

      var localforage = document.createElement('iron-meta').byKey('localforage');
      localforage.getItem('search.searchTerms.last').then(function (lastValue) {
        console.log('getItem(\'search.searchTerms.last\') => ' + lastValue);
        _this2.set('searchTerm', lastValue || '');
        _this2.set('searchTermTmp', lastValue || '');
        _this2.$.searchInput.value = _this2.searchTermTmp;
      });
    }
  });
})();