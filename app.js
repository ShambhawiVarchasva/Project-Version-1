var express = require('express');
const request=require('request');
var path = require('path'); //to deal with paths
const cookieSession=require('cookie-session');
const cors=require('cors');
const Grid=require('gridfs-stream');
const methodOverride=require('method-override');
const publicVapidKey='BJF7EE3FT4REMaWVoDXgjiKIBM17XcNkIifyn0S5jx6fJaX5ccZTMt_aZS1mWf0WMg2pga8lKKF1SQrspM8B6vk';
const privateVapidKey='y-xMMxDyHugth3SPUr1gcmXejYA1UsUJw-0CYiJTw6g';
const webpush=require('web-push');
const multer=require('multer');
const GridFsStorage=require('multer-gridfs-storage');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var exphb = require('pug');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
//var nodemailer = require("nodemailer");
mongoose.connect('mongodb://localhost/project');
//var gser = require('./models/googleuser');
const mongoURI='mongodb://localhost/project';
let db = mongoose.connection;
let gfs;
// Check connection
db.once('open', function(){
  var gfs=Grid(db.db,mongoose.mongo);
  gfs.collection('uploads');
  console.log('Connected to MongoDB');
});
db.on('error', function(err){
  console.log(err);
});

var routes = require('./routes/index');
var users = require('./routes/users');
var profile = require('./routes/profile');
var article=require('./routes/article');
var poll=require('./routes/poll');
var captcha=require('./routes/captcha');
var resume=require('./routes/resume');
// Init App
var app = express();  //create express app
app.use(methodOverride('_method'));

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));



webpush.setVapidDetails('mailto:gdivya686@gmail.com',publicVapidKey,privateVapidKey);
app.post("/subscribe", (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const payload = JSON.stringify({ title: "Push Test" });

  // Pass object into sendNotification
  webpush
    .sendNotification(subscription, payload)
    .catch(err => console.error(err));
});
//setting up view engine
app.set('view engine', 'handlebars');
//app.set('view engine', 'pug');

// BodyParser Middleware
app.use(bodyParser.json());    //add middlewares
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: ['netninja']
}));

app.use(cors());
// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);
app.use('/profile', profile);
app.use('/article', article);
app.use('/poll', poll);
app.use('/captcha',captcha);
app.use('/resume',resume);


// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));//callback function
});

//routes(app);