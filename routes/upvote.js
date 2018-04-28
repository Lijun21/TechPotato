var express = require("express");
var router  = express.Router();
var ProjectDB = require("../models/project");
var Upvote = require("../models/vote");
var Middleware = require("../middleware");

router.post("/projects/:id/vote", Middleware.isLoggedIn, function(req, res){
    ProjectDB.findById(req.params.id, function(err, projectFound){
        if (err){
            req.flash("error", "Ops..can't find the project you want to vote");
            console.log(err);
            res.redirect("/projects");
        }else{
            Upvote.find({'projectId': req.params.id}, function(err, FoundAllProjectVoteRecords){
                var FindVoteBefore = FoundAllProjectVoteRecords.find(function(eachVote){
                    return eachVote.upvoter.username == req.user.username
                })
                if (FindVoteBefore){
                    req.flash("error", "You have voted");
                    return res.redirect('/projects/' + projectFound._id);
                }else{
                    Upvote.create({}, function(err, vote){
                        if(err){
                            console.log(err);
                        }else {
                            vote.upvoter.id = req.user._id;
                            vote.upvoter.username = req.user.username;
                            vote.projectId = projectFound._id;
                            vote.save();
                            projectFound.upvote.push(vote);
                            projectFound.save();
                            req.flash("success", "You vote has been added");
                            return res.redirect('/projects/' + projectFound._id);
                        }
                    })
                }
            })
        }
    })
})

module.exports = router;



