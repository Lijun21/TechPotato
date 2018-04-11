var express = require("express");
var router  = express.Router();
var User    = require("../models/user");
var passport = require("passport");
var middleware = require("../middleware");
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

// app.use("/", indexRoutes);

//Landing page redirct to project page
router.get("/", function(req, res){
    res.redirect("/projects");
});

// SHOW register form
router.get("/register", function(req, res){
    res.render("register", {page: "register"}); 
 });

 //REGISTER add new user to DB
router.post("/register", function(req, res){
     var newUser = new User({
        username: req.body.username, 
        email: req.body.email
    });
    //model.passport-local-mongoose methods to crypto password and username.
    User.register(newUser, req.body.password, function(err, user){
      // eval(require('locus'));
        if(err){
            console.log(err.message);
            return res.render("register", {error: "Please use other username or email"});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to our site " + user.username);
           res.redirect("/projects"); 
        });
    });
});
 
 // SHOW login form
 router.get("/login", function(req, res){
    res.render("login", {page: "login"}); 
 });

 // POSE login logic
 router.post("/login", passport.authenticate("local", 
     {
         successRedirect: "/projects",
         failureRedirect: "/login",
         failureFlash: true,
         successFlash: 'Welcome to join tech project!'
     }), function(req, res){
 });
 
 //LOGOUT route
 router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/projects");
 });

 

 //how to pop up another tap to fill out this form???
 //Show Admin login form 
 router.get("/admin", function(req, res){
    res.render("admin"); 
 });
 //register admin 
 router.post("/admin", function(req, res){
     var newUser = new User({username: req.body.username});
     if (req.body.adminCode === "Admin123"){
        newUser.isAdmin = true; 
     }
     User.register(newUser, req.body.password, function(err, user){
         if(err){
            req.flash("error", err.message);
            return res.redirect("admin");
         }
         passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome Admin " + user.username);
            res.redirect("/projects"); 
         });
     });
 });


//====RESET PASSWORD ROUTES =======================================
router.get('/forgot', function(req, res) {
    res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
              user: 'tproject2018@gmail.com',
              pass: '2018@Tproject'
          }
      });
        var mailOptions = {
          to: user.email,
          from: '🤑 tproject2018@gmail.com',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
      
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });

router.get('/reset/:token', function(req, res) {
    console.log(req.params.token);
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
        }
        res.render('reset', {token: req.params.token});
    });
});

router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired!!!.');
            return res.redirect('back');
          }
          if (req.body.password === req.body.confirm){
            user.setPassword(req.body.passport, function(err){
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
      
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
              user: 'tproject2018@gmail.com',
              pass: '2018@Tproject'
          }
      });
        var mailOptions = {
          to: user.email,
          from: 'hahaha😝Yo',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/');
    });
  });

 module.exports = router;