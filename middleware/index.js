var projectDB = require("../models/project");
var Comment = require("../models/comment");

//all the middleware gose here
var projectMiddleware = {};

//middleware function 
projectMiddleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

projectMiddleware.checkprojectOwnership = function(req, res, next){
    //if the user is logged in?
    if (req.isAuthenticated()){
        projectDB.findById(req.params.id, function(err, foundproject){
            if (err || !foundproject){
                console.log(err);
                req.flash("error", "project not found");
                res.redirect("back");
            } else {
                //if the user is the owner of the project
                if (foundproject.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "You need to be logged in to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

projectMiddleware.checkCommentOwnership = function(req, res, next){
    //is the user login in?
    if (req.isAuthenticated()){
        projectDB.findById(req.params.id, function(err, foundproject){
            if (err || !foundproject){
                console.log(err);
                res.redirect("back");
            } else {
                //is the user the owner of the comment
                Comment.findById(req.params.comment_id, function(err, foundComment){
                    if (foundComment.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash("error", "You don't have permission to do that");
                        res.redirect("back");
                    }
                });
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

module.exports = projectMiddleware;
