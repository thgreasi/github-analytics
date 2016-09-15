import $ from 'jquery';
import localforage from 'localforage';
import Rx from 'Rx';

import { init as paperHeaderInit } from './paperHeader';

import { GithubService } from './GithubServiceMock';
import { NpmService } from './NpmServiceMock';
import RepositoryDetails from './RepositoryDetails';

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



window.GithubService = GithubService;
window.NpmService = NpmService;
window.RepositoryDetails = RepositoryDetails;

app.repos = [];
app.loadedPromise.then(() => {

  var userReposPromise = GithubService.getUserRepos('thgreasi');
  var orgsPromise = GithubService.getUserOrgs('thgreasi');

  var overallPromises = [processRepoInfos(userReposPromise)];

  overallPromises.push(orgsPromise.then(orgs => {
    return Promise.all(orgs.map(o => processRepoInfos(GithubService.getUserRepos(o.login))));
  }));

  return Promise.all([overallPromises]);
});

function processRepoInfos (reposPromise) {
  return reposPromise.then(repos => {
      repos = repos.map(repo => Object.assign(new RepositoryDetails(), repo));
      
      console.log(repos);
      if (repos.length) {
        app.repos.push.apply(app.repos, repos);
        app.set('repos', app.repos.slice());
      }

        // let args = repos.slice();
        // args.unshift('app.repos');
        // console.log(args);
        // app.push.apply(app, args);
    });
}
