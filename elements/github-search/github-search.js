'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'github-search',

    properties: {
      searchTerm: {
        type: String,
        // value: 'Welcome!',
        notify: true,
        observer: '_debounced_searchTermChanged'
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

      // isSearching: {
      //   type: Boolean,
      //   notify: true
      // },

      userInfos: {
        type: Array,
        default: function _default(f) {
          return [];
        },
        notify: true,
        readOnly: true
      },

      repoInfos: {
        type: Array,
        default: function _default(f) {
          return [];
        },
        notify: true,
        readOnly: true
      },

      activeUserPromise: {
        type: Object,
        default: function _default(f) {
          return null;
        },
        notify: true,
        readOnly: true
      },

      activeRepoPromise: {
        type: Object,
        default: function _default(f) {
          return null;
        },
        notify: true,
        readOnly: true
      },

      selectedUser: {
        type: Object,
        default: function _default(f) {
          return null;
        },
        notify: true,
        readOnly: true
      },

      selectedUserReposPromise: {
        type: Object,
        default: function _default(f) {
          return null;
        },
        notify: true,
        readOnly: true
      },

      selectedUserRepos: {
        type: Array,
        default: function _default(f) {
          return [];
        },
        notify: true,
        readOnly: true
      }
    },

    _debounced_searchTermChanged: function _debounced_searchTermChanged() {
      this.debounce('_searchTermChanged', function () {
        this._searchTermChanged();
      }, 500);
    },

    _searchTermChanged: function _searchTermChanged() {
      var _this = this;

      if (!this.searchTerm || this.searchTerm.length < 3) {
        this._setUserInfos([]);
        this._setActiveUserPromise(null);

        this._setRepoInfos([]);
        this._setActiveRepoPromise(null);
      }

      if (this.searchProvider && this.searchProvider.searchUser) {
        (function () {
          var promise = _this.searchProvider.searchUser(_this.searchTerm);
          _this._setActiveUserPromise(promise);
          promise.then(function (u) {
            if (_this.activeUserPromise === promise) {
              if (u && u.items) {
                _this._setUserInfos(u.items);
              } else {
                _this._setUserInfos([]);
              }
              _this._setActiveUserPromise(null);
            }
          }, function () {
            _this._setUserInfos([]);
          });
        })();
      }

      if (this.searchProvider && this.searchProvider.searchRepo) {
        (function () {
          var promise = _this.searchProvider.searchRepo(_this.searchTerm);
          _this._setActiveRepoPromise(promise);
          promise.then(function (u) {
            if (_this.activeRepoPromise === promise) {
              if (u && u.items) {
                _this._setRepoInfos(u.items);
              } else {
                _this._setRepoInfos([]);
              }
              _this._setActiveRepoPromise(null);
            }
          }, function () {
            _this._setRepoInfos([]);
          });
        })();
      }
    },

    toggleRepoListItemsSelection: function toggleRepoListItemsSelection(e, detail) {
      var button = e.currentTarget || e.target;
      var items = Array.prototype.slice.apply(document.querySelectorAll(button.dataset.targetContainer + ' search-repo-list-item'));

      if (button.dataset.targetType) {
        (function () {
          var invertFilter = button.dataset.targetType.indexOf('!') === 0;
          var filterPropName = button.dataset.targetType;
          if (invertFilter) {
            filterPropName = filterPropName.replace('!', '');
          }

          items = items.filter(function (element) {
            return element.item && !element.item[filterPropName] === invertFilter;
          });
        })();
      }
      this._toggleRepoListItemsSelection(items);
    },

    _toggleRepoListItemsSelection: function _toggleRepoListItemsSelection(items) {
      var selected = [];
      var unselected = [];

      items.forEach(function (element) {
        if (element.isSaved) {
          selected.push(element);
        } else {
          unselected.push(element);
        }
      });

      if (selected.length === items.length) {
        selected.forEach(function (element) {
          element.toggleSaveUserRepo();
        });
      } else {
        unselected.forEach(function (element) {
          element.toggleSaveUserRepo();
        });
      }
    },

    openUserInfoDialog: function openUserInfoDialog(e, detail) {
      var _this2 = this;

      this._setSelectedUser(e.model.item);
      this._setSelectedUserRepos([]);
      this._setSelectedUserReposPromise(this.searchProvider.getUserRepos(e.model.item.login).then(function (repos) {
        _this2._setSelectedUserRepos(repos);
        _this2._setSelectedUserReposPromise(null);
        return repos;
      }));

      this.selectedUserReposPromise.catch(function () {}).then(function () {
        _this2.$.userInfoDialog.refit();
      });
      this.$.userInfoDialog.open();
    },

    userInfoDialogOK: function userInfoDialogOK(e, detail) {},

    ready: function ready() {}
  });
})();