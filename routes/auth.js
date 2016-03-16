var express = require('express');
var router = express.Router();

//add auth packages
var passport = require('passport');
var mongoose = require('mongoose');
var Account = require('../models/account');
var gitHub = require('passport-github2');
var configDb = require('../config/db.js');

passport.serialUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    Account.findById(id, function(err, user) {
        done(err, user);
    });
});

//tell passport to use gitHub

passport.use(new gitHub({
    clientID: configDb.githubClientId,
    clientSecret: configDb.githubClientSecret,
    callbackURL: configDb.githubCallbackUrl
}, function(accessToken, refreshToken, profile, done) {
        var searchQuery = { name: profile.displayName };

        /*var updates = {
            name: profile.displayName,
            someID: profile.id
        };

        var options = { upsert: true };

        Account.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
            if (err) {
                return done(err);
            }
            else {
                return done(null, user);
            }
        });*/
    }
));

//GET register and display the form
router.get('/register', function(req, res, next) {
	res.render('auth/register', {
		title: 'Register'
	});
});

//POST register and display the form
router.post('/register', function(req, res, next) {
	Account.register(new Account({ username: req.body.username }), req.body.password, function(err, account) {
        if (err) {
           res.render('auth/register', { title: 'Register' });
        }
        else {
            req.login(account, function(err) {
                res.redirect('/articles');
            });
        }
    });
});

//GET login and display the form
router.get('/login', function(req, res, next) {

    // store the session messages in a local variable
    var messages = req.session.messages || [];

    // clear the session messages
    req.session.messages = [];

    // show the login page and pass in any messages we may have
    res.render('auth/login', {
        title: 'Login',
        user: req.user,
        messages: messages
    });
});


//POST login - validate the user and send them to articles or back to login
router.post('/login', passport.authenticate('local', {
   successRedirect: '/articles',
   failureRedirect: '/auth/login',
   failureMessage: 'Invalid Login'
}));

//Make the file public
module.exports = router;