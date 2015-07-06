var rest   = require('restler')
  , OAuth  = require('oauth-1.0a')
  , _      = require('lodash')
;

module.exports = {
  init: function() {
  }
  , run: function(step, dexter) {
      if(!step.input('url')) 
        return this.fail({
          message: 'A URL is required',
          input: step.inputs()
        });

      var self  = this
        , consumer_key    = this.environment('instapaper_consumer_key')
        , consumer_secret = this.environment('instapaper_consumer_secret')
        , access_token    = dexter.wfdata.simulation
            ? JSON.parse(require('./fixtures/env').providers.instapaper.access_token)
            : JSON.parse(dexter.provider('instapaper.access_token'))
        , token_key       = access_token.oauth_token
        , token_secret    = access_token.oauth_token_secret
        , url             = 'https://www.instapaper.com/api/1/bookmarks/add'
        , oauth = OAuth({
            consumer: {
                public  : consumer_key
                , secret: consumer_secret
            }
            , signature_method: 'HMAC-SHA1'
        })
        , token = {
            public  : token_key
            , secret: token_secret
        }
        , postData = {
            data   : step.inputs(),
            headers: oauth.toHeader(oauth.authorize({
                url: url
                , method: 'POST'
                , data: step.inputs()
            }, token))
        }
      ;
        
      rest.post(url, postData).on('complete', function(result, response) {
        try {
            if(response.statusCode != 200) {
                return self.fail({
                    statusCode  : response.statusCode,
                    headers     : response.headers,
                    oauth       : oauth, 
                    token       : token,
                    data        : result,
                    input       : step.inputs()
                });
            }
              
            self.complete({
                title             : response.headers['x-instapaper-title']
                , contentLocation : response.headers['content-location']
                , statusCode      : response.statusCode
                , bookmarkId      : result[0].bookmark_id
                , headers         : response.headers
            });
          } catch(e) {
            /* ignore any error parsing and just return null */     
            self.fail(e);
          }
      });
  }
};
