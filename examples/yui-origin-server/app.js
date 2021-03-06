/*jslint node:true, nomen: true*/

'use strict';

var express = require('express'),
    exphbs  = require('express3-handlebars'),
    expyui  = require('../../'), // express-yui
    app     = express();

expyui.extend(app);

if ('development' === app.get('env')) {
    // when using `expyui.debug()` middleware you will get debug,
    // filter and logLevel set accordingly at the app level.
    // In this case, `raw` version instead of `debug`.
    app.use(expyui.debug({ filter: 'raw' }));
}

app.yui.setCoreFromAppOrigin();

// template engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// serving static yui modules
app.use(expyui['static'](__dirname, {
    maxAge: 100
}));

// exposing yui into the client side for all requests
app.use(expyui.expose());

// using debug when a querystring `?debug=1` is passed
app.use(function(req, res, next) {
    if (req.query.debug) {
        expyui.debug()(req, res, next);
    } else {
        next();
    }
});

// creating a page with YUI embeded
app.get('/', function (req, res, next) {
    res.render('page');
});

// listening
app.set('port', process.env.PORT || 8666);
app.listen(app.get('port'), function () {
    console.log("Server listening on port " +
        app.get('port') + " in " + app.get('env') + " mode");
});
