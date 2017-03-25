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
      },

      debug: {
        type: Boolean,
        notify: false
      }
    },

    _searchTermUnDebouncedChangedObserver: function _searchTermUnDebouncedChangedObserver(newValue) {
      var _this = this;

      this.debounce('searchTermChanged', function () {
        _this.set('searchTerm', newValue);
      }, 1000);
    },

    _searchTermChangedObserver: function _searchTermChangedObserver(newValue) {
      var _this2 = this;

      var localforage = document.createElement('iron-meta').byKey('localforage');
      localforage.setItem('search.searchTerms.last', newValue).then(function () {
        _this2.debug && console.log('setItem(\'search.searchTerms.last\', ' + newValue + ') Saved!');
      }).catch(function (e) {
        console.error('setItem(\'search.searchTerms.last\', ' + newValue + ') Error', e);
      });
    },

    setSearchTerm: function setSearchTerm() {
      this.set('searchTerm', this.searchTermTmp || '');
    },

    ready: function ready() {
      var _this3 = this;

      this.$.searchForm.addEventListener('iron-form-presubmit', function (event) {
        event.preventDefault();
        _this3.setSearchTerm();
      });

      var localforage = document.createElement('iron-meta').byKey('localforage');
      localforage.getItem('search.searchTerms.last').then(function (lastValue) {
        _this3.debug && console.log('getItem(\'search.searchTerms.last\') => ' + lastValue);
        _this3.set('searchTerm', lastValue || '');
        _this3.set('searchTermTmp', lastValue || '');
        _this3.$.searchInput.value = _this3.searchTermTmp;
      });
    }
  });
})();