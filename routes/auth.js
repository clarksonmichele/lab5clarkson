var express = require('express');
var router = express.Router();

//add auth packages
var passport = require('passport');
var mongoose = require('mongoose');
var Account = require('../models/account');

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
	res.render('auth/login', {
		title: 'Login',
		user: req.user,
		massages: req.sesssion.messages || []
	});

	//clear out session messages so they don't just build up 
	req.session.messages = [];
});

//POST login - validate the user and send them to articles or back to login
router.post('/login', passport.authenticate('local', {
   successRedirect: '/articles',
   failureRedirect: '/auth/login',
   failureMessage: 'Invalid Login'
}));

//Make the file public
module.exports = router;