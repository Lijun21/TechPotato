var User    = require("./models/user"),
    seedDB  = require("./seeds");

var express         = require("express"),
    path            = require('path'),
    favicon         = require('serve-favicon'),
    mongoose        = require("mongoose"),
    flash           = require('connect-flash'),
    moment          = require("moment"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    session         = require("express-session"),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override");

    var cookieParser = require('cookie-parser');
    var nodemailer = require('nodemailer');
    var bcrypt = require('bcrypt-nodejs');
    var async = require('async');
    var crypto = require('crypto');

//Requring Routes
var commentRoutes    = require("./routes/comments"),
    potatoRoutes = require("./routes/potatos"),
    indexRoutes      = require("./routes/index");
    userRoutes       = require("./routes/user");

// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://lijun:Wang@ds241039.mlab.com:41039/tech_potato");
var app = express();

// app.set('port', process.env.PORT || 8000);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.set('views', path.join(__dirname, 'views'));
//why favion doesn't show up in the browser???? ...
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(flash());
app.locals.moment = moment;
// seedDB();

// PASSPORT CONFIGURATION
app.use(session({
    secret: "hum, i don't like dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Pass currentUser info to all routes and flash messages
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
 });

//Make routes short in moudules
app.use("/", indexRoutes);
app.use("/potatos", potatoRoutes);
app.use("/potatos/:id/comments", commentRoutes);
app.use("/", userRoutes);


app.listen(8000, function(){
    console.log("this is yelp has started on 8000");
})

