import localforage from 'localforage';
import Rx from 'Rx';

import { app, loadedPromise } from './appCore';
import { init as appThemeInit } from './appTheme';

import { GithubService } from './GithubServiceMock';
import { NpmService } from './NpmServiceMock';
import RepositoryDetails from './RepositoryDetails';


appThemeInit();


app.GithubService = GithubService;
app.NpmService = NpmService;
app.RepositoryDetails = RepositoryDetails;

app.repos = [];


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

app.reloadPage = function() {
  if (app.crntPageElement && typeof app.crntPageElement.refresh === 'function') {
    app.crntPageElement.refresh();
  }
};

loadedPromise.then(() => {

  var userReposPromise = GithubService.getUserRepos('thgreasi');
  var orgsPromise = GithubService.getUserOrgs('thgreasi');

  var overallPromises = [processRepoInfosPromise(userReposPromise)];

  overallPromises.push(orgsPromise.then(orgs => {
    return Promise.all(orgs.map(o => processRepoInfosPromise(GithubService.getUserRepos(o.login))));
  }));

  return Promise.all([overallPromises]);
});


function processRepoInfos (repos) {
  repos.forEach((repo) => {
    repo.setStargazers(repo.stargazers_count);
    repo.setDownloads(repo.downloads);
  });
  
  if (repos.length) {
    app.repos.push.apply(app.repos, repos);
    app.set('repos', app.repos.slice());
  }

  // let args = repos.slice();
  // args.unshift('app.repos');
  // console.log(args);
  // app.push.apply(app, args);
}

function processRepoInfosPromise (reposPromise) {
  return reposPromise.then(repos => processRepoInfos(repos));
}
