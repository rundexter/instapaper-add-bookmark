var Instapaper = require('instapaper')
  , _          = require('lodash')
  , q          = require('q')
  , apiUrl     = 'https://www.instapaper.com/api/1.1'
;

module.exports = {
  run: function(step, dexter) {
      var auth        = dexter.provider('instapaper').credentials() 
        , client      = Instapaper(auth.consumer_key, auth.consumer_secret, {apiUrl: apiUrl})
        , urls        = step.input('url')
        , folder_id   = step.input('folder_id').first()
        , self        = this
        , connections = []
        , results     = []
      ;   

      if(!urls.length) return self.fail('url required');

      client.setOAuthCredentials(auth.access_token, auth.access_token_secret);

      _.each(urls, function(url) {
          var deferred = q.defer();

          client.bookmarks.client.request('/bookmarks/add', {url: url, folder_id: folder_id})
             .then(function(result) {
                 results.push({
                     bookmark_id: result[0].bookmark_id
                 });
                 deferred.resolve();
             }).catch(function(err) {
                 deferred.reject(err);
             });

          connections.push(deferred.promise);
      });

      q.all(connections)
         .then(this.complete.bind(this, results))
         .fail(this.fail.bind(this));
  }
};
