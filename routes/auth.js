var express = require('express');
var router = express.Router();

//GET register and display the form
router.get('/register', function(req, res, next) {
	res.render('auth/register', {
		title: 'Register'
	});
});

//GET login and display the form
router.get('/login', function(req, res, next) {
	res.render('auth/login', {
		title: 'Login'
	});
});


//Make the file public
module.exports = router;