'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'starred-items-page',

    properties: {
      repos: {
        type: Array,
        notify: true
      },
      activePromise: {
        type: Object,
        default: function _default(f) {
          return null;
        },
        notify: true,
        readOnly: true
      },
      updateDate: {
        type: Date,
        default: function _default() {
          return null;
        },
        notify: true,
        readOnly: true
      },
      updateDateLocal: {
        type: String,
        notify: true,
        computed: '_computeUpdateDateLocal(updateDate)'
      },
      updateDateISO: {
        type: String,
        notify: true,
        computed: '_computeUpdateDateISO(updateDate)'
      },
      sortingOptions: {
        type: Array,
        notify: true,
        value: function value() {
          return [
          // { name: 'No sort', value: 'none' },
          { name: 'By name', value: 'name' }, { name: 'By stars', value: 'stargazers_count' }, { name: 'By downloads', value: 'downloads' }];
        }
      },
      sortingType: {
        type: String,
        notify: true,
        value: function value() {
          return 'name';
        },
        observer: '_sortingTypeChangedObserver'
      },
      sortingDropDownOpened: {
        type: Boolean,
        notify: true
      },
      debug: {
        type: Boolean,
        notify: false
      }
    },

    observers: ['_itemsChanged(repos.*)'],

    // _debounced_reposChanged: function(changeRecord) {
    //   this.debounce('_itemsChanged', () => {
    //    this._itemsChanged.apply(this, arguments);
    //   }, 200);
    // },

    _itemsChanged: function _itemsChanged(changeRecord) {
      this.debug && console.log('_itemsChanged', changeRecord);
      var ironMeta = document.createElement('iron-meta');
      var dataItemsLoaded = ironMeta.byKey('dataItemsLoaded');
      if (!dataItemsLoaded) {
        // do not save anything until the old data are loaded
        this.debug && console.log('_itemsChanged save skipped');
        return;
      }
      var localforage = ironMeta.byKey('localforage');
      localforage.setItem('data.repos', this.repos).then(function () {
        // this.debug && console.log('Saved', 'data.repos', this.repos);
      });
    },


    openSortingDropDown: function openSortingDropDown() {
      this.set('sortingDropDownOpened', true);
    },

    sortingOptionSelected: function sortingOptionSelected() {
      this.set('sortingDropDownOpened', false);
    },

    _sortingTypeChangedObserver: function _sortingTypeChangedObserver(newValue) {
      var _this = this;

      if (!newValue) {
        return;
      }
      var localforage = document.createElement('iron-meta').byKey('localforage');
      localforage.setItem('starred-items.sortingType.last', newValue).then(function () {
        _this.debug && console.log('setItem(\'starred-items.sortingType.last\', ' + newValue + ') Saved!');
      }).catch(function (e) {
        console.error('setItem(\'starred-items.sortingType.last\', ' + newValue + ') Error', e);
      });
    },

    refresh: function refresh() {
      var _this2 = this;

      var promise = Promise.all(this.repos.map(function (repo) {
        var setFn = function setFn(subPath, value) {
          var index = _this2.repos.indexOf(repo);
          if (index >= 0) {
            _this2.debug && console.log('Updating repos.#' + index + subPath + ': ' + value);
            _this2.set('repos.#' + index + subPath, value);
          }
        };
        return Promise.all([repo.updateDetails(setFn), repo.updateDownloads(setFn)].map(function (p) {
          return p.catch(function (e) {
            console.error('Error:', e);
          });
        }));
      }));

      this._setActivePromise(promise);

      promise.catch(function () {}).then(function () {
        if (_this2.activePromise === promise) {
          _this2._setActivePromise(null);
        }
      });

      promise.then(function (results) {
        if ((results || []).filter(function (x) {
          return !!x && !!x[0];
        }).length) {
          var d = new Date();
          _this2._setUpdateDate(d);
          var localforage = document.createElement('iron-meta').byKey('localforage');
          localforage.setItem('data.repos.updateDate', d);
        }
      });

      return promise;
    },

    _computeUpdateDateLocal: function _computeUpdateDateLocal(updateDate) {
      if (!updateDate) {
        return '';
      }
      return updateDate.toString();
    },

    _computeUpdateDateISO: function _computeUpdateDateISO(updateDate) {
      if (!updateDate) {
        return '';
      }
      return updateDate.toISOString();
    },

    ready: function ready() {
      var _this3 = this;

      var localforage = document.createElement('iron-meta').byKey('localforage');
      localforage.getItem('data.repos.updateDate').then(function (d) {
        if (d && !_this3.updateDate) {
          _this3._setUpdateDate(d);
        }
      });

      localforage.getItem('starred-items.sortingType.last').then(function (lastValue) {
        _this3.debug && console.log('getItem(\'starred-items.sortingType.last\') => ' + lastValue);
        if (lastValue && lastValue !== _this3.sortingType) {
          _this3.set('sortingType', lastValue);
        }
      });
    }
  });
})();