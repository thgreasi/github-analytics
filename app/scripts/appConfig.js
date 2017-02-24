import { app } from './appCore';
import localforage from 'localforage';
import { GithubService } from './Services/GithubService';
import { NpmService } from './Services/NpmService';

localforage.config({
  name: 'githubAnalytics'
});
console.log('localforage.config', localforage.config());

app.GithubService = GithubService;
app.NpmService = NpmService;
app.localforage = localforage;

export {
	GithubService,
	NpmService
};
