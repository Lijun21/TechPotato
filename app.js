//====DEPENDENCIES =========================================
var express         = require("express"),
    app             = express(),
    path            = require('path'),
    favicon         = require('serve-favicon'),
    mongoose        = require("mongoose"),
    flash           = require('connect-flash'),
    moment          = require("moment"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    session         = require("express-session"),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    cookieParser    = require('cookie-parser');

var User    = require("./models/user"),
    seedDB  = require("./seeds");

//====ROUTES====================================================
var commentRoutes    = require("./routes/comments"),
    projectRoutes    = require("./routes/projects"),
    indexRoutes      = require("./routes/index"),
    userRoutes       = require("./routes/user");
    voteRoutes       = require("./routes/upvote");

//====SERVE FAVICON================================================
app.use(favicon(__dirname + '/public/images/favicon.ico'));


//====MONGOOOSE AND MONGOD==========================================  
// for production
// var mongoDbServer =  process.env.MONGODBSERVER;
// for development
var mongoDbServer = "mongodb://localhost/tech_project";
mongoose.connect(mongoDbServer);


//====EXPRESS SET PORT,TEMPLATE ENGINE,VIEW DIR,PUBLIC DIR ETC====
app.set('port', process.env.PORT || 8000);
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(flash());
app.locals.moment = moment;
// seedDB();

//====CONFIGURATION OF EXPRESS AND PASSPORT========================
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

//====PASS DATA TO ROUTES========================================
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
 });

//====ROUTING=====================================================
app.use("/", indexRoutes);
app.use("/projects", projectRoutes);
app.use("/projects/:id/comments", commentRoutes);
app.use("/", userRoutes);
app.use("/", voteRoutes);


//====LISTEN TO THE SERVER =======================================
app.listen(app.get('port'), function(){
    console.log("this is yelp has started on 8000");
})

