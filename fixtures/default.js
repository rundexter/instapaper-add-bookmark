var _   = require('lodash')
  , env = require('./env')
;

module.exports = _.merge({
    "internals": {
        /*
         * SAMPLE DATA 
         *
         * These properties will be set by the engine when your step is called.
         */
        "instance": {
            "id": "i962a3ce-883b-4976-a583-29440a7f638d",
            "isTest": true // will be false when run by the workflow engine
        }
        ,"workflow": {
            "id": "w962a3ce-883b-4976-a583-29440a7f638d"
        }
        ,"step": {
            "id": "s962a3ce-883b-4976-a583-29440a7f638d"
        }
    },
    "input": {
       "url": "http://io9.com/5985580/dont-be-fooled-dolphins-are-actually-huge-assholes"
    },
    "settings": {
       /*
        * settings data passed to the step
        * "mustache": "A sample {mustache} template"
        */
    }
});
