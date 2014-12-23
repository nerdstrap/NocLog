require.config({
    config: {
        'env': {
            apiUrl: '',
            siteRoot: ''
        },
        'models/AppLocationModel': {
            'timeout': 5000,
            'enableHighAccuracy': false,
            'maximumAge': 6000
        },
        'hbs': {
            'extension': 'html'
        }
    },
    paths: {
        /* Require */
        'require': 'libs/require',
        'text': 'libs/text',
        'hbs': 'libs/hbs',

        /* jQuery */
        'jquery': 'libs/jquery',

        /* Underscore */
        'underscore': 'libs/lodash',

        /* Backbone */
        'backbone': 'libs/backbone',
        'backbone.validation': 'libs/backbone.validation',

        /* Handlebars */
        'Handlebars': 'libs/handlebars',
        'handlebars.helpers': 'app/handlebars.helpers',

        /* Modernizr */
        'modernizr': 'libs/modernizr',

        /* FileSaver */
        'filesaver': 'libs/filesaver',

        /* Foundation */
        'foundation.core': 'libs/foundation',
        'foundation.alert': 'libs/foundation.alert',

        /* Jasmine */
        /*'jasmine': 'libs/jasmine/jasmine',
        'jasmine-html': 'libs/jasmine/jasmine-html',*/

        /* App */
        'console': 'app/console',
        'dates': 'app/dates',
        'env': 'app/env',
        'events': 'app/events',
        'globals': 'app/globals',
        'resources': 'app/resources',
        'utils': 'app/utils',
        'utils.views': 'app/utils.views',

        /* Convenience */
        'collections': '../collections',
        'controllers': '../controllers',
        'enums': '../enums',
        'models': '../models',
        'routers': '../routers',
        'services': '../services/memory',
        'templates': '../templates',
        'views': '../views',
        'specs': '../specs'
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'foundation.core': {
            deps: [
                'jquery',
                'modernizr'
            ],
            exports: 'Foundation'
        },
        'foundation.alert': {
            deps: [
                'foundation.core'
            ]
        },
        'Handlebars': {
            exports: 'Handlebars'
        }/*,
        'jasmine': {
            exports: 'jasmine'
        },
        'jasmine-html': {
            deps: [
                'jasmine'
            ],
            exports: 'jasmine'
        }*/
    }
});

// Global error handler
requirejs.onError = function(err) {
    if (err) {
        console.log(err.message);
        if (err.originalError) {
            console.log(err.originalError.message);
        }
        if (err.requireType) {
            if (err.requireType === 'timeout') {
                console.log('modules: ' + err.requireModules);
            }
        }
    }

    throw err;
};

// Load our app module and pass it to our definition function
require(['console', 'spec-app']);