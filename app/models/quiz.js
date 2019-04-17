const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

const quizSchema = new Schema({
    question:{type:String},
      option1:{type:String},
      point1:{type:Number},
      option2:{type:String},
      point2:{type:Number},
      option3:{type:String},
      point3:{type:Number,default:0},
      option4:{type:String},
      point4:{type:Number,default:0},
      rightAnswer:{type:String},
      imageName:{type:String},
      yogaSutra:{type:String},
      thematic:{type:String,required: true},
      createdAt:{
        type: Date, 
        default: Date.now()
      }

});

// Create a model
const Quiz = mongoose.model('quiz', quizSchema);

// Export the model
module.exports = Quiz;

