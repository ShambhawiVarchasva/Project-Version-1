var express = require('express');
var router = express.Router();
let Article = require('../models/user');
const authCheck = (req, res, next) => {
    if(!req.user){
        console.log(req.user);
        res.redirect('/users/login');
    } else {
        next();
    }
};
// Get Homepage
router.get('/', authCheck,function(req, res){
	res.render(profile ,{ user: req.user });
	//res.render('index');
});





module.exports = router;     //export syntax for nodejs
