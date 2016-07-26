import $ from 'jquery';
import localforage from 'localforage';
import Rx from 'Rx';

import { init as paperHeaderInit } from './paperHeader';

import { GithubService } from './GithubService';
import { NpmService } from './NpmService';


// Grab a reference to our auto-binding template
// and give it some initial binding values
// Learn more about auto-binding templates at http://goo.gl/Dx1u2g
var app = document.querySelector('#app');

// Sets app default base URL
app.baseUrl = '/';
if (window.location.port === '') {  // if production
  // Uncomment app.baseURL below and
  // set app.baseURL to '/your-pathname/' if running from folder in production
  // app.baseUrl = '/polymer-starter-kit/';
}

app.readyPromise = new Promise(function(resolve) {
  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
    resolve();
  });
});

app.loadedPromise = new Promise(function(resolve) {
  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    resolve();
  });
});

app.loadedPromise.then(() => {
  console.log('Our app is ready to rock!');
});


paperHeaderInit();


app.displayInstalledToast = function() {
  // Check to make sure caching is actually enabled—it won't be in the dev environment.
  if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
    Polymer.dom(document).querySelector('#caching-complete').show();
  }
};

// Scroll page to top and expand header
app.scrollPageToTop = function() {
  app.$.headerPanelMain.scrollToTop(true);
};

app.closeDrawer = function() {
  app.$.paperDrawerPanel.closeDrawer();
};



var githubService = window.githubService = new GithubService();
var npmService = window.npmService = new NpmService();

app.repos = [];
app.loadedPromise.then(() => {

  var userReposPromise = githubService.getUserRepos('thgreasi');
  var orgsPromise = githubService.getUserOrgs('thgreasi');

  var overallPromises = [processRepoInfos(userReposPromise)];

  overallPromises.push(orgsPromise.then(orgs => {
    return Promise.all(orgs.map(o => processRepoInfos(githubService.getUserRepos(o.login))));
  }));

  return Promise.all([overallPromises]);
});

function processRepoInfos (reposPromise) {
  return reposPromise.then(repos => {
      app.repos.push.apply(app.repos, repos);

      return Promise.all(repos.map(repo => {
        npmService.getDownloadCountsLastMonth(repo.name).then(dls => {
          repo.downloads = dls.downloads;
          app.set('repos', app.repos.slice());
          // var oldRepos = app.repos.slice();
          // app.set('repos', []);
          // setTimeout(() => app.set('repos', oldRepos));
          return dls;
        }).catch(() => {});
      }));
    });
}
