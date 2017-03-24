import { app, loadedPromise } from './appCore';
import './appSW';
import { init as appThemeInit } from './appTheme';
import { GithubService } from './appConfig';

import localforage from 'localforage';
import RepositoryDetails from './Model/RepositoryDetails';


appThemeInit();

app.repos = [];


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

app.searchPageBtnTap = function() {
  app.page.show('/');
};

app.dataItemsLoaded = false;
var reposOnLoadPromise = localforage.getItem('data.repos').then(repos => {
    if (!Array.isArray(repos)) {
      repos = [];
    }

    repos = repos.map(repo => Object.assign(new RepositoryDetails(), repo).clearSessionData());

    app.debug && console.log('LOADED!', repos);
    return repos;
}).catch(() => []);

loadedPromise.then(() => {
  app.debug && console.log('loadedPromise');
  return reposOnLoadPromise.then(repos => {
    // app.$.dataReposStorage.set('autoSaveDisabled', false);
    app.set('dataItemsLoaded', true);
    app.set('repos', repos);
    app.debug && console.log('SET repos', repos);

    if (repos && repos.length) {
      setTimeout(() => {
        app.page.show('/repositories');
        app.reloadPage();
      }, 0);
    }
  });

  // return getUserAndOrgRepos('thgreasi');

});

function getUserAndOrgRepos(username) {
  var userReposPromise = GithubService.getUserRepos(username);
  var orgsPromise = GithubService.getUserOrgs(username);

  var overallPromises = [processRepoInfosPromise(userReposPromise)];

  overallPromises.push(orgsPromise.then(orgs => {
    return Promise.all(orgs.map(o => processRepoInfosPromise(GithubService.getUserRepos(o.login))));
  }));

  return Promise.all([overallPromises]);
}


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
  // app.debug && console.log(args);
  // app.push.apply(app, args);
}

function processRepoInfosPromise (reposPromise) {
  return reposPromise.then(repos => processRepoInfos(repos));
}
