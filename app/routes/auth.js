const QuizController           = require('../controllers/quiz.js');
const multer 		           = require('multer');
const path			           = require('path');
const Quiz      = require('../models/quiz');
const Result    = require('../models/result');


module.exports =function(router, passport) {
    //localhost:8080/auth/
    router.get('/',function(req, res){
        res.render('index.ejs');
    });
    //localhost:8080/auth/login
    router.get('/login',function(req,res){
        res.render('login.ejs',{message: req.flash('loginMessage')});
    
        
    });


    //process the login form
    router.post('/login',passport.authenticate('local-login',{
        successRedirect :'/profile',
        failureRedirect : '/login',
        failureFlash    : true
    }));


    //show signup form
    router.get('/signup',function(req, res){
        res.render('signup.ejs',{message: req.flash('signupMessage')});
    });

    //process the signup form
    router.post('/signup',passport.authenticate('local-signup',{
        successRedirect :'/profile',
        failureRedirect : '/signup',
        failureFlash    : true
    }));


    // google routes
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    router.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    router.get('/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
            }));


   

    //profile section: we want this to be protected so u have to be logged in to visit and will use route middleware to verify this(isLoggedIn function)
    router.get('/profile',isLoggedIn, function(req,res){
        // console.log(req.user);
        res.render('profile.ejs',{user:req.user});//get the user out of session and pass to template
    });

    router.get('/logout',function(req,res){
        req.logout();
        res.redirect('/auth');
    });

    //route middleware to make sure a user is logged in
    function isLoggedIn(req,res,next){
    //if user is authenticated in the session , carry on 
        if(req.isAuthenticated())
            return next();
    
        //if they aren't redirect them to the home page
        res.redirect('/auth');
    }


    //Authorize(when user is already logged in /connecting other social account)
    //locally
    router.get('/connect/local',function(req, res){
        res.render('connect-local.ejs',{message: req.flash('loginMessage')});
    });
    router.post('/connect/local',passport.authenticate('local-signup',{
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/profile', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    //google
    router.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

    // the callback after google has authorized the user
    router.get('/connect/google/callback',passport.authorize('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
    }));
    
    // unlink accounts
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    // local
    router.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            if(err)
                throw err
            res.redirect('/profile');
        });
    });

   

    // google 
    router.get('/unlink/google', function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            if(err)
                throw err
            res.redirect('/profile');
        });
    });

    //to upload images 
    const storage = multer.diskStorage({
        destination: './uploads',
        filename: function(req, file, callback){
          callback(null,file.originalname + '-' + Date.now() + path.extname(file.originalname));
  
        }
  
    });

    const upload = multer({
        storage: storage,
        // limits:{fileSize: 1000000},
        fileFilter: function(req, file, cb){
          checkFileType(file, cb);
        }
    });
  
    // Check File Type
    function checkFileType(file, cb){
        // Allowed ext
        const filetypes = /jpeg|jpg|png|gif/;
        // Check ext
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
         // Check mime
        const mimetype = filetypes.test(file.mimetype);
  
        if(mimetype && extname){
            return cb(null,true);
        } else {
            cb('Error: Images Only!');
        }
    }
  
    //to add question in database (mongoDB)
    router.post('/createQuestion', upload.single('myImage'),QuizController.createQuestion);

    router.get('/main', isLoggedIn,function(req,res){
        res.render('main.ejs',{user:req.user});//get the user out of session and pass to template
    });
    

    //to get the question of thematic 1
    router.get('/getQuiz/1',isLoggedIn, QuizController.getQuiz1);


    //to get the question of thematic 2
    router.get('/getQuiz/2',isLoggedIn, QuizController.getQuiz2);


    router.post('/saveResult',isLoggedIn, QuizController.saveResult);
    
    // router.post('/saveResult',isLoggedIn, function(req,res){
    //     console.log(answer);
    // });
        
        
    

    


}