'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'repo-list-item',

    properties: {
      items: {
        type: Array,
        notify: true
      },
      item: {
        type: Object,
        notify: true,
        observer: '_itemChangedObserver',
        value: function value() {
          return {};
        }
      },
      // stargazersDiff: {
      //   type: Number,
      //   readOnly: true
      // },
      // downloadsDiff: {
      //   type: Number,
      //   readOnly: true
      // },
      itemIcon: {
        type: String,
        notify: true,
        computed: '_computeItemIcon(item)'
      },
      debug: {
        type: Boolean,
        notify: false
      }
    },

    // observers: [
    //     '_stargazersChanged(item.stargazers_count)',
    //     '_downloadsChanged(item.downloads)'
    // ],

    // _stargazersChanged: function (newValue) {
    //   let diff = this._getLastRecordsDiff(this.item && this.item.stargazersHistory);
    //   this._setStargazersDiff(diff);
    // },

    // _downloadsChanged: function (newValue) {
    //   let diff = this._getLastRecordsDiff(this.item && this.item.downloadsHistory);
    //   this._setDownloadsDiff(diff);
    // },

    // _getLastRecordsDiff: function (array) {
    //   if (array &&
    //       array.length >= 2) {
    //     let len = array.length;
    //     return array[len - 1].value - array[len - 2].value;
    //   }
    //   return 0;
    // },

    _itemChangedObserver: function _itemChangedObserver(item) {
      var _this = this;

      if (item && !item.downloadsHistory.length && typeof item.updateDownloads === 'function') {
        // this seems to be a new item, so fetch its downloads
        item.updateDownloads(function (subPath, value) {
          var index = _this.items.indexOf(item);
          if (index >= 0) {
            _this.debug && console.log('Updating item' + subPath + ': ' + value);
            _this.set('item' + subPath, value);
          }
        });
      }
    },

    _computeItemIcon: function _computeItemIcon(item) {
      if (item && item.fork) {
        return 'app-svg-icons:repo-forked-icon';
      }
      return 'app-svg-icons:repo-icon';
    },

    unstarRepoTap: function unstarRepoTap() {
      var _this2 = this;

      this.$.unstarToast.show();
      this.$.collapse.hide();
      this.$.unstarToast.undoTimeout = setTimeout(function () {
        _this2.$.unstarToast.undoTimeout = null;
        _this2.fire('unstar', { item: _this2.item });
      }, this.$.unstarToast.duration);
    },

    undoUnstar: function undoUnstar() {
      var _this3 = this;

      if (this.$.unstarToast.undoTimeout) {
        clearTimeout(this.$.unstarToast.undoTimeout);
        this.$.unstarToast.hide();
        this.$.unstarToast.undoTimeout = null;

        setTimeout(function () {
          _this3.$.collapse.show();
        }, 500);
      }
    },

    isPositive: function isPositive(number) {
      return number > 0;
    },

    isNegative: function isNegative(number) {
      return number < 0;
    },

    getDiffClass: function getDiffClass(diff) {
      if (diff > 0) {
        return 'positive-diff';
      }
      if (diff < 0) {
        return 'negative-diff';
      }
    },

    isRelevantScale: function isRelevantScale(value, scaleValue) {
      return value && (!scaleValue || scaleValue < 100 || Math.abs(value / scaleValue) >= 0.01);
    },

    normalizeNumberLength: function normalizeNumberLength(num) {
      var scaleLiterals = ['k', 'm', 'b', 't'];

      var sign = num < 0 ? '-' : '';
      var scale = Math.min(Math.log10(Math.abs(num)) | 0, scaleLiterals.length * 3);
      if (scale >= 3) {
        var tmp = Math.abs(num) / Math.pow(10, scale - scale % 3);
        if (scale % 3 === 0) {
          tmp = (10 * tmp | 0) / 10;
        } else {
          tmp = tmp | 0;
        }
        return sign + tmp + scaleLiterals[(scale / 3 | 0) - 1];
      }

      return num + '';
    }
  });
})();