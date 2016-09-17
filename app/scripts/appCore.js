// Grab a reference to our auto-binding template
// and give it some initial binding values
// Learn more about auto-binding templates at http://goo.gl/Dx1u2g
export var app = document.querySelector('#app');

// Sets app default base URL
app.baseUrl = '/';
if (window.location.port === '') {  // if production
  // Uncomment app.baseURL below and
  // set app.baseURL to '/your-pathname/' if running from folder in production
  // app.baseUrl = '/polymer-starter-kit/';
}

export var readyPromise = new Promise(function(resolve) {
  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
    resolve();
  });
});

export var loadedPromise = new Promise(function(resolve) {
  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    resolve();
  });
});
