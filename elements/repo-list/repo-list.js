'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'repo-list',

    properties: {
      items: {
        type: Array,
        notify: true
      },
      sort: {
        type: String,
        value: function value() {
          return '';
        }
      }
    },

    _sortItems: function _sortItems() {
      return this._sortItemsComparator.bind(this);
    },

    _sortItemsComparator: function _sortItemsComparator(a, b) {
      if (!this.sort || this.sort === 'none') {
        return 0;
      }

      var ascSorting = !this.sort || this.sort === 'name' ? 1 : -1;

      var aa = a[this.sort];
      var bb = b[this.sort];
      if (aa < bb) {
        return -1 * ascSorting;
      }
      if (aa > bb) {
        return 1 * ascSorting;
      }
      return 0;
    },

    unstarItem: function unstarItem(sender, details) {
      if (this.items && details && details.item) {
        var index = this.items.indexOf(details.item);
        if (index >= 0) {
          this.splice('items', index, 1);
        }
      }
    },

    ready: function ready() {}
  });
})();