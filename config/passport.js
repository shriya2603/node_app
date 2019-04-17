const User              = require('../app/models/user');
const LocalStrategy     = require('passport-local').Strategy;
const GoogleStrategy    = require('passport-google-oauth').OAuth2Strategy;
const BearerStrategy    = require('passport-http-bearer').Strategy;

const configAuth        = require('./auth');
const express           = require('express');
const router            = express.Router();

//expose this function to our app using module.exports
module.exports  = function(passport) {
    passport.serializeUser(function(user, done){
        done(null, user.id);

    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    //local signup
    passport.use('local-signup', new LocalStrategy({
        usernameField :'email',
        passwordField :'password',
        passReqToCallback:true
    },
    function(req, email, password, done){
        process.nextTick(function(){
            //find a user whose email is the same as the forms email. 
            //we are checking to see if the user trying to login already exists
            User.findOne({'local.email': email},function(err, user){
                if(err)
                    return done(err);
                    
                    //check to see if there is already a user with that email
                if(user){
                    // console.log('email id already exists');
                    return done(null, false, req.flash('signupMessage','email id already exists'));
                    
                }if(!req.user){
                    //if there is no user  with that email then create user
                    var newUser  = new User();
                    //set user local credentials
                    newUser.local.email =email;
                    newUser.local.password=newUser.generateHash(password);
                    
                    //save user
                    newUser.save(function(err){
                        if(err)
                            throw err;
                        // console.log(newUser);
                        return done(null, newUser);
                        
                        
                    });
                }else{
                    var user = req.user;
                    user.local.email =email;
                    user.local.password=user.generateHash(password);

                    user.save(function(err){
                        if(err)
                            throw err;
                        return done(null,user);
                    });
                }
            });
        });
    }));



    //login
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                // console.log(err);
                return done(err);
            // if no user is found, return the message
            if (!user)
                // console.log('No user found ');
                return done(null, false, req.flash('loginMessage', 'No user found.')); 

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                // console.log('Oops! Wrong password.');
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // if no error then return successful user
            // console.log(user);
            return done(null, user);
        });

    }));

    //google
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        passReqToCallback:true

    },
    function(req, token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            if(!req.user){
                // try to find the user based on their google id
                User.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);//error 500

                    if(user){
                        if (!user.google.token) {
                            user.google.token = token;
                            user.google.name  = profile.displayName;
                            user.google.email = profile.emails[0].value; // pull the first email

                            user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }
                        return done(null, user);
                    } else {
                        // if the user isnt in our database, create a new user
                        var newUser          = new User();

                        // set all of the relevant information
                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = profile.emails[0].value; // pull the first email

                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            // console.log('new user '+user);
                            return done(null, newUser);
                        });
                    }
                });
            } else {
                var newUser          = new User();

                newUser.google.id    = profile.id;
                newUser.google.token = token;
                newUser.google.name  = profile.displayName;
                newUser.google.email = profile.emails[0].value; // pull the first email

                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

    }));
     
    passport.use(new BearerStrategy(
        function(token, done) {
          User.findOne({ _id: token }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user, { scope: 'all' });
          });
        }
      ));


};




