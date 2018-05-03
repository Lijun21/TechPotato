var express = require("express");
var router  = express.Router();
var ProjectDB = require("../models/project");
var Middleware = require("../middleware");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'djmlbebuv', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//app.use("/projects", projectRoutes);

//Index - show all projects
router.get("/", function(req, res){
    var search = req.query.search;
    if (search){
        // eval(require('locus'));
        ProjectDB.find({name: search}, function(err, Findproject){
            if(err){
                console.log(err);
                res.render("projects/index", {projects:{}, page: 'projects'});
            }else{
                res.render("projects/index", {projects:Findproject, page: 'projects'});
            }
        })
    }else{
        ProjectDB.find({}, function(err, allproject){
            if (err){
                console.log(err);
            }else{
                res.render("projects/index", {projects:allproject, page: 'projects'});
            }
        });
    }
});

//GET/New - show from to create new project
router.get("/new/", Middleware.isLoggedIn, function(req, res){
    res.render("projects/new");
})

router.post("/", Middleware.isLoggedIn, upload.array('project[image]'), function(req, res){
    cloudinary.uploader.upload(req.files[0].path, function(result) {
        // add cloudinary url for the image to the project object under image property
        req.body.project.image = result.secure_url;
        // add author to project
        req.body.project.author = {
          id: req.user._id,
          username: req.user.username
        }
        ProjectDB.create(req.body.project, function(err, Newproject) {
          if (err || !Newproject ) {
            req.flash('error', err.message);
            return res.redirect('back');
          }else{
            req.flash("success", "You new project has been Created =)");
            res.redirect('/projects/');
          }
        });
    });
});

//GET/SHOW - shows more info about one project
router.get("/:id", function(req, res){
    ProjectDB.findById(req.params.id).populate("comments").exec(function(err, foundproject){
        if (err){
            console.log(err);
        } else {
            res.render("projects/show", {project:foundproject});
        }
    });
});

//GET/Edit - show edit form for a project
router.get("/:id/edit", Middleware.checkprojectOwnership, function(req, res){
    ProjectDB.findById(req.params.id, function(err, foundproject){
        res.render("projects/edit", {project: foundproject});
    });
});

// PUT - update campgournd in the DB
router.put("/:id", Middleware.checkprojectOwnership, function(req, res){
    // find and update the correct project
    ProjectDB.findByIdAndUpdate(req.params.id, req.body.project, function(err, updatedproject){
       if(err || !updatedproject){
           res.redirect("/projects");
       } else {
           //redirect somewhere(show page)
           res.redirect("/projects/" + req.params.id);
       }
    });
});

//DELETE - removes project and its comments from the database
router.delete("/:id", Middleware.checkprojectOwnership, function(req, res){
    ProjectDB.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/projects");
        } else {
            res.redirect("/projects");
        }
    })
});

module.exports = router;