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
      stargazersDiff: {
        type: Number,
        readOnly: true
      },
      downloadsDiff: {
        type: Number,
        readOnly: true
      },
      itemIcon: {
        type: String,
        notify: true,
        computed: '_computeItemIcon(item)'
      }
    },

    observers: ['_stargazersChanged(item.stargazers_count)', '_downloadsChanged(item.downloads)'],

    _stargazersChanged: function _stargazersChanged(newValue) {
      var diff = this.getLastRecordsDiff(this.item && this.item.stargazersHistory);
      this._setStargazersDiff(diff);
    },

    _downloadsChanged: function _downloadsChanged(newValue) {
      var diff = this.getLastRecordsDiff(this.item && this.item.downloadsHistory);
      this._setDownloadsDiff(diff);
    },

    _itemChangedObserver: function _itemChangedObserver(newValue) {
      var _this = this;

      if (newValue && typeof newValue.updateDownloads === 'function') {
        newValue.updateDownloads().then(function (dls) {
          // console.log(`${this.item.name} dls:`,
          //   this.item.downloads == dls.downloads ?
          //     `${this.item.downloads}` :
          //     `${this.item.downloads} -> ${dls.downloads}`,
          //   ` historyLen: ${this.item.downloadsHistory && this.item.downloadsHistory.length}`);

          _this.notifyPath('item.downloads', dls.downloads);
        });
      }
    },

    _computeItemIcon: function _computeItemIcon(item) {
      if (item && item.fork) {
        var weatherIconID = item.weather[0].id;
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

    getLastRecordsDiff: function getLastRecordsDiff(array) {
      if (array && array.length >= 2) {
        var len = array.length;
        return array[len - 1].value - array[len - 2].value;
      }
      return 0;
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
        var tmp = Math.abs(num) / Math.pow(10, scale);
        if (scale % 3 === 0) {
          tmp = (10 * tmp | 0) / 10;
        } else {
          tmp = tmp | 0;
        }
        return sign + tmp + scaleLiterals[(scale / 3 | 0) - 1];
      }

      return num;
    }
  });
})();