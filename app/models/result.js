const mongoose      = require('mongoose');
const Quiz          = require('../models/quiz');
const User          = require('../models/user');
const Schema        = mongoose.Schema;

const resultSchema  = new Schema({
    userId :{type:Schema.Types.ObjectId, ref: 'User'},
    quizId :{type:Schema.Types.ObjectId, ref:'Quiz'},
    userResult:{type:String,required:true},
    date:{
        type: Date, 
        default: Date.now()
    }

});


// Create a model
const Result = mongoose.model('result', resultSchema);

// Export the model
module.exports = Result;