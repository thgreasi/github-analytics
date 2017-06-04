(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('localforage')) :
	typeof define === 'function' && define.amd ? define(['localforage'], factory) :
	(factory(global.localforage));
}(this, function (localforage) { 'use strict';

	localforage = 'default' in localforage ? localforage['default'] : localforage;

	var babelHelpers = {};

	babelHelpers.classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	babelHelpers.createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

	babelHelpers;

	// Grab a reference to our auto-binding template
	// and give it some initial binding values
	// Learn more about auto-binding templates at http://goo.gl/Dx1u2g
	var app = document.querySelector('#app');

	// Sets app default base URL
	app.baseUrl = '/';
	if (window.location.port === '') {
	  // if production
	  // Uncomment app.baseURL below and
	  // set app.baseURL to '/your-pathname/' if running from folder in production
	  app.baseUrl = '/github-analytics/';
	}

	var loadedPromise = new Promise(function (resolve) {
	  // Listen for template bound event to know when bindings
	  // have resolved and content has been stamped to the page
	  app.addEventListener('dom-change', function () {
	    resolve();
	  });
	});

	app.displayInstalledToast = function () {
	  // Check to make sure caching is actually enabled—it won't be in the dev environment.
	  if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
	    Polymer.dom(document).querySelector('#caching-complete').show();
	  }
	};

	app.displayUpdatedToast = function () {
	  Polymer.dom(document).querySelector('#caching-updated').show();
	};

	function init() {
	  initPageHeader();
	}

	function initPageHeader() {
	  // Main area's paper-scroll-header-panel custom condensing transformation of
	  // the appName in the middle-container and the bottom title in the bottom-container.
	  // The appName is moved to top and shrunk on condensing. The bottom sub title
	  // is shrunk to nothing on condensing.
	  window.addEventListener('paper-header-transform', function (e) {
	    var appName = Polymer.dom(document).querySelector('#mainToolbar .app-name');
	    var middleContainer = Polymer.dom(document).querySelector('#mainToolbar .middle-container');
	    var bottomContainer = Polymer.dom(document).querySelector('#mainToolbar .bottom-container');
	    var detail = e.detail;
	    var heightDiff = detail.height - detail.condensedHeight;
	    var yRatio = Math.min(1, detail.y / heightDiff);
	    // appName max size when condensed. The smaller the number the smaller the condensed size.
	    var maxMiddleScale = 0.50;
	    var auxHeight = heightDiff - detail.y;
	    var auxScale = heightDiff / (1 - maxMiddleScale);
	    var scaleMiddle = Math.max(maxMiddleScale, auxHeight / auxScale + maxMiddleScale);
	    var scaleBottom = 1 - yRatio;

	    // Move/translate middleContainer
	    Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

	    // Scale bottomContainer and bottom sub title to nothing and back
	    Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

	    // Scale middleContainer appName
	    Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
	  });
	}

	var RepositoryDetails = function () {
	    function RepositoryDetails() {
	        babelHelpers.classCallCheck(this, RepositoryDetails);

	        this.stargazersHistory = [];
	        this.downloadsHistory = [];
	    }

	    babelHelpers.createClass(RepositoryDetails, [{
	        key: 'clearData',
	        value: function clearData() {
	            this.stargazersHistory = [];
	            this.downloadsHistory = [];
	            this.clearResolvedData();
	            return this;
	        }
	    }, {
	        key: 'clearResolvedData',
	        value: function clearResolvedData() {
	            this.packageType = undefined;
	            this.packageName = undefined;
	            this.clearSessionData();
	            return this;
	        }
	    }, {
	        key: 'clearSessionData',
	        value: function clearSessionData() {
	            this.stargazersDiff = null;
	            this.downloadsDiff = null;
	            return this;
	        }
	    }, {
	        key: '_setProp',
	        value: function _setProp(key, value, setPathFn) {
	            if (this[key] !== value) {
	                if (typeof setPathFn === 'function') {
	                    setPathFn('.' + key, value);
	                } else {
	                    this[key] = value;
	                }
	            }
	        }
	    }, {
	        key: 'setStargazers',
	        value: function setStargazers(value, setPathFn) {
	            if (value !== +value) {
	                return;
	            }

	            var date = new Date();
	            this.stargazersHistory = this.stargazersHistory || [];
	            if (!this.stargazersHistory.length || this.stargazers_count !== value) {
	                this.stargazersHistory.push({
	                    date: date,
	                    value: value
	                });
	            }

	            if (this.stargazers_count !== value) {
	                if (this.stargazersHistory.length > 1) {
	                    this._setProp('stargazersDiff', value - this.stargazers_count, setPathFn);
	                }
	                this._setProp('stargazers_count', value, setPathFn);
	                this._setProp('stargazers_count_lastUpdateDate', date, setPathFn);
	            }
	        }
	    }, {
	        key: 'updateDetails',
	        value: function updateDetails(setPathFn) {
	            var _this = this;

	            var GithubService = document.createElement('iron-meta').byKey('GithubService');
	            return GithubService.getRepoDetails(this.full_name).then(function (data) {
	                if (!data) {
	                    return;
	                }

	                _this.setStargazers(data.stargazers_count, setPathFn);
	                Object.keys(data).filter(function (key) {
	                    return typeof data[key] !== 'function' && key !== 'stargazersHistory' && key !== 'downloadsHistory' && key !== 'viewModelData';
	                }).forEach(function (key) {
	                    return _this._setProp(key, data[key], setPathFn);
	                });
	                return data;
	            });
	        }
	    }, {
	        key: 'setDownloads',
	        value: function setDownloads(value, setPathFn) {
	            if (value !== +value) {
	                return;
	            }

	            var date = new Date();
	            this.downloadsHistory = this.downloadsHistory || [];
	            if (!this.downloadsHistory.length || this.downloads !== value) {
	                this.downloadsHistory.push({
	                    date: this.downloads_lastUpdateDate,
	                    value: value
	                });
	            }

	            if (this.downloads !== value) {
	                if (this.downloadsHistory.length > 1) {
	                    this._setProp('downloadsDiff', value - this.downloads, setPathFn);
	                }
	                this._setProp('downloads', value, setPathFn);
	                this._setProp('downloads_lastUpdateDate', date, setPathFn);
	            }
	        }
	    }, {
	        key: 'getPackageJsonName',
	        value: function getPackageJsonName() {
	            if (this.packageType === 'package.json' && this.packageName) {
	                return Promise.resolve(this.packageName);
	            }

	            if (this.packageType !== false && !this.packageType) {
	                var GithubService = document.createElement('iron-meta').byKey('GithubService');
	                return GithubService.getRepoContents(this.full_name, 'package.json').then(function (contentInfo) {
	                    if (contentInfo && contentInfo.type === 'file') {
	                        var packageJson = JSON.parse(atob(contentInfo.content));
	                        return packageJson.name;
	                    }
	                });
	            }

	            return Promise.resolve();
	        }
	    }, {
	        key: 'updateDownloads',
	        value: function updateDownloads(setPathFn) {
	            var _this2 = this;

	            if (this.fork) {
	                return Promise.resolve();
	            }

	            this.downloads_lastRequestDate = new Date();

	            var packageNamePromise = this.getPackageJsonName().then(function (packageName) {
	                _this2._setProp('packageType', 'package.json', setPathFn);
	                _this2._setProp('packageName', packageName, setPathFn);
	                return packageName;
	            }).catch(function (err) {
	                console.error(err);
	                _this2._setProp('packageType', false, setPathFn);
	            });

	            return packageNamePromise.then(function (packageName) {
	                if (!packageName) {
	                    return;
	                }

	                if (_this2.packageType === 'package.json') {
	                    var NpmService = document.createElement('iron-meta').byKey('NpmService');
	                    return NpmService.getDownloadCountsLastMonth(packageName).then(function (dls) {
	                        _this2.setDownloads(dls.downloads, setPathFn);
	                        return dls;
	                    });
	                }
	            });
	        }
	    }]);
	    return RepositoryDetails;
	}();

	var BASE_URL = 'https://api.github.com/';

	var GithubService = function () {
	    function GithubService() {
	        babelHelpers.classCallCheck(this, GithubService);
	    }

	    babelHelpers.createClass(GithubService, null, [{
	        key: 'getUserInfo',
	        value: function getUserInfo(username) {
	            return fetch(BASE_URL + ('users/' + username)).then(function (response) {
	                return response.json();
	            }).catch(function (err) {
	                console.log(err);
	                return err;
	            });
	        }
	    }, {
	        key: 'getUserOrgs',
	        value: function getUserOrgs(username) {
	            return fetch(BASE_URL + ('users/' + username + '/orgs')).then(function (response) {
	                return response.json();
	            }).catch(function (err) {
	                console.log(err);
	                return err;
	            });
	        }
	    }, {
	        key: 'getUserRepos',
	        value: function getUserRepos(username) {
	            return fetch(BASE_URL + ('users/' + username + '/repos')).then(function (response) {
	                return response.json();
	            }).then(function (repos) {
	                return repos.map(function (repo) {
	                    return {
	                        id: repo.id,
	                        name: repo.name,
	                        owner: repo.ownder,
	                        full_name: repo.full_name,
	                        description: repo.description,
	                        fork: repo.fork,
	                        html_url: repo.html_url,
	                        url: repo.url,
	                        tags_url: repo.tags_url,
	                        stargazers_count: repo.stargazers_count,
	                        watchers_count: repo.watchers_count
	                    };
	                }).filter(function (repo) {
	                    return !repo.fork;
	                }).map(function (repo) {
	                    return Object.assign(new RepositoryDetails(), repo);
	                });
	            }).catch(function (err) {
	                console.log(err);
	                return err;
	            });
	        }
	    }, {
	        key: 'getRepoDetails',
	        value: function getRepoDetails(fullname /* OR username, reponame */) {
	            fullname = arguments.length === 2 ? arguments[0] + '/' + arguments[1] : fullname;

	            return fetch(BASE_URL + ('repos/' + fullname)).then(function (response) {
	                return response.json();
	            }).then(function (repo) {
	                // the only extras are: network_count & subscribers_count
	                return Object.assign(new RepositoryDetails(), repo);
	            }).catch(function (err) {
	                console.log(err);
	                return err;
	            });
	        }

	        // app.GithubService.getRepoContents('thgreasi/ui-sortable', 'package.json').then(function(data){ console.log(data); })

	    }, {
	        key: 'getRepoContents',
	        value: function getRepoContents(fullname, path) {
	            // /repos/:owner/:repo/contents/:path
	            return fetch(BASE_URL + ('repos/' + fullname + '/contents/' + path)).then(function (response) {
	                return response.json();
	            }).catch(function (err) {
	                console.log(err);
	                return err;
	            });
	        }

	        // https://developer.github.com/v3/search/#search-users
	        // file:///home/teo/Drive/Dev/githubAnalytics/research/docs/Search%20|%20GitHub%20Developer%20Guide.html#search-users

	    }, {
	        key: 'searchUser',
	        value: function searchUser(username) {
	            // https://api.github.com/search/users?q=thgre
	            return fetch(BASE_URL + ('search/users?q=' + username)).then(function (response) {
	                return response.json();
	            }).catch(function (err) {
	                console.log(err);
	                return err;
	            });
	        }

	        // TODO: add TopN parameter
	        // https://developer.github.com/v3/search/#search-repositories
	        // file:///home/teo/Drive/Dev/githubAnalytics/research/docs/Search%20|%20GitHub%20Developer%20Guide.html#search-repositories

	    }, {
	        key: 'searchRepo',
	        value: function searchRepo(reponame) {
	            // https://api.github.com/search/repositories?q=localfora
	            return fetch(BASE_URL + ('search/repositories?q=' + reponame)).then(function (response) {
	                var result = response.json();
	                return result;
	            }).then(function (result) {
	                if (!result.items) {
	                    console.log('search/repositories?q=' + reponame + ' => ', result);
	                    result.items = [];
	                }
	                result.items = result.items.map(function (repo) {
	                    return Object.assign(new RepositoryDetails(), repo);
	                });
	                return result;
	            }).catch(function (err) {
	                console.log(err);
	                return err;
	            });
	        }
	    }]);
	    return GithubService;
	}();

	var NpmService = function () {
	    function NpmService() {
	        babelHelpers.classCallCheck(this, NpmService);
	    }

	    babelHelpers.createClass(NpmService, null, [{
	        key: "getDownloadCountsLastMonth",
	        value: function getDownloadCountsLastMonth(packageName) {
	            return fetch("https://api.npmjs.org/downloads/point/last-month/" + packageName).then(function (response) {
	                return response.json();
	            }).catch(function (err) {
	                console.log(err);
	                return err;
	            });
	        }

	        // static getDistTags (packageName) {
	        //     var promise = $.get(`http://registry.npmjs.org/-/package/${packageName}/dist-tags`);
	        //     // return promise;
	        //     return promise.catch(null, function (err) {
	        //         console.log(err);
	        //     });
	        // }

	    }, {
	        key: "searchNpm",
	        value: function searchNpm(packageName) {
	            return fetch("http://npmsearch.com/query?q=" + packageName + "&fields=name").then(function (response) {
	                return response.json();
	            }).catch(null, function (err) {
	                console.log(err);
	                return err;
	            });
	        }
	    }]);
	    return NpmService;
	}();

	app.debug = false;

	localforage.config({
		name: 'githubAnalytics'
	});
	app.debug && console.log('localforage.config', localforage.config());

	app.GithubService = GithubService;
	app.NpmService = NpmService;
	app.localforage = localforage;

	init();

	app.repos = [];

	// Scroll page to top and expand header
	app.scrollPageToTop = function () {
	  app.$.headerPanelMain.scrollToTop(true);
	};

	app.closeDrawer = function () {
	  app.$.paperDrawerPanel.closeDrawer();
	};

	app.reloadPage = function () {
	  if (app.crntPageElement && typeof app.crntPageElement.refresh === 'function') {
	    app.crntPageElement.refresh();
	  }
	};

	app.searchPageBtnTap = function () {
	  app.page.show('/');
	};

	app.dataItemsLoaded = false;
	var reposOnLoadPromise = localforage.getItem('data.repos').then(function (repos) {
	  if (!Array.isArray(repos)) {
	    repos = [];
	  }

	  repos = repos.map(function (repo) {
	    return Object.assign(new RepositoryDetails(), repo).clearSessionData();
	  });

	  app.debug && console.log('LOADED!', repos);
	  return repos;
	}).catch(function () {
	  return [];
	});

	loadedPromise.then(function () {
	  app.debug && console.log('loadedPromise');
	  return reposOnLoadPromise.then(function (repos) {
	    // app.$.dataReposStorage.set('autoSaveDisabled', false);
	    app.set('dataItemsLoaded', true);
	    app.set('repos', repos);
	    app.debug && console.log('SET repos', repos);

	    if (repos && repos.length) {
	      setTimeout(function () {
	        app.page.show('/repositories');
	        app.reloadPage();
	      }, 0);
	    }
	  });

	  // return getUserAndOrgRepos('thgreasi');
	});

}));
//# sourceMappingURL=app.js.map