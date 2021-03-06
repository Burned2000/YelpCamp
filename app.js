var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    Campground     = require("./models/campground"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    seedDB         = require("./seeds"),
    mehtodOverride = require("method-override"),
    flash          = require("connect-flash");

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes       = require("./routes/index");

app.use(flash());
app.use( mehtodOverride("_method"));
    mongoose.connect('mongodb://localhost:27017/yelp_camp_v6', {useNewUrlParser: true,useUnifiedTopology:true});
    app.use(bodyParser.urlencoded({extended: true}));
    app.set("view engine", "ejs");
    app.use(express.static(__dirname + "/public"));
    //Seed the database.
    // seedDB();
    
    // PASSPORT CONFIGURATION
    app.use(require("express-session")({
        secret: "Once again Rusty wins cutest dog!",
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    
    app.use(function(req, res, next){
       res.locals.currentUser = req.user;
       res.locals.error = req.flash("error");
       res.locals.success = req.flash("success");
       next();
    });

app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/",authRoutes);

app.listen(8080, function(){
    console.log("Connected to YelpCamp");
})    