module.exports = function(router, passport){
    router.use(function(req, res, next){
        if(req.isAuthenticated())
            return next();
    
        //if they aren't redirect them to the home page
        res.redirect('/auth');
    });
    router.get('/profile', function(req,res){
        // console.log(req.user._id);
        res.render('profile.ejs',{user:req.user});//get the user out of session and pass to template
    });

  

    // router.get('/testing',function(req,res){
    //     res.redirect('/profile');
    // });
}