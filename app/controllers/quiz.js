const Quiz      = require('../models/quiz');
const Result    = require('../models/result');
const multer 		= require('multer');
const ejs 			= require('ejs');
const path			= require('path');

module.exports = {
    createQuestion:(req,res)=>{//
        const newQuiz = new Quiz();
        newQuiz.question=req.body.question;
        newQuiz.option1=req.body.option1;
        newQuiz.point1=req.body.point1;
    
        newQuiz.option2=req.body.option2;
        newQuiz.point2=req.body.point2;
    
        newQuiz.option3=req.body.option3;
        newQuiz.point3=req.body.point3;
        
        newQuiz.option4=req.body.option4;
        newQuiz.point4=req.body.point4;
    
        newQuiz.rightAnswer=req.body.rightAnswer;
        newQuiz.imageName=req.file.path;
        newQuiz.yogaSutra=req.body.yogaSutra;
        newQuiz.thematic=req.body.thematic;
        
        newQuiz.save(function (err) {
          res.send(newQuiz.question);

        });
    },
    getQuiz1:(req, res)=>{
      Quiz.find({thematic:"1"}).then(function(quiz){
        const question =quiz[Math.floor(Math.random()*quiz.length)];
        
        if(question!=null){
          // res.json({question});
        //   console.log(question);
          res.render('quiz.ejs',{question});
          
        }
        else{
          // res.json({message:'quiz of this thematic not found'});
          res.render('error.ejs');
        }
      });
   
    },
    getQuiz2:(req, res)=>{
      Quiz.find({thematic:"2"}).then(function(quiz){
        const question =quiz[Math.floor(Math.random()*quiz.length)];
        
        if(question!=null){
          // res.json({question});
        //   console.log(question);
          res.render('quiz.ejs',{question});
          
        }
        else{
          // res.json({message:'quiz of this thematic not found'});
          res.render('error.ejs');
        }
      });
   
    },
    
    saveResult:(req,res)=>{
      const newResult=new Result();
      newResult.userId=req.user._id;
      newResult.quizId=req.q_id;
      newResult.userResult=req.a;
      console.log(req.q_id);
  
      newResult.save(function (err) {
        if (err) {
            console.log("Saving Result Failed.." + err);
            // res.json({ success: false, data: err });
            console.log("err");
        }
        else {
            console.log("Result is Saved..",newResult.userResult);
            // res.json({ success: true, data: newResult });
            console.log(newResult);
        }
      });
  
  
    },

}