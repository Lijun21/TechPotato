var potatoDB = require("../models/potato");
var Comment = require("../models/comment");

//all the middleware gose here
var potatoMiddleware = {};

//middleware function 
potatoMiddleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

potatoMiddleware.checkpotatoOwnership = function(req, res, next){
    //if the user is logged in?
    if (req.isAuthenticated()){
        potatoDB.findById(req.params.id, function(err, foundpotato){
            if (err || !foundpotato){
                console.log(err);
                req.flash("error", "potato not found");
                res.redirect("back");
            } else {
                //if the user is the owner of the potato
                if (foundpotato.author.id.equals(req.user._id) || req.user.isAdmin){
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

potatoMiddleware.checkCommentOwnership = function(req, res, next){
    //is the user login in?
    if (req.isAuthenticated()){
        potatoDB.findById(req.params.id, function(err, foundpotato){
            if (err || !foundpotato){
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

module.exports = potatoMiddleware;
