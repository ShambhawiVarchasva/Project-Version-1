var express = require('express');
var router = express.Router();

let Article = require('../models/articles');
// Get Homepage
router.get('/', ensureAuthenticated,function(req, res){
	Article.find({}, function(err, articles){
		if(err){
		  console.log(err);
		} else {
		  res.render('index', {
			title:'Articles',
			articles: articles
		  });
		}
	  });
	//res.send("Welcome");
	//res.render('index');
});
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}
module.exports = router;