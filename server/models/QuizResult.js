   const mongoose = require('mongoose');

   const quizResultSchema = new mongoose.Schema({   
       score: { type: Number, required: true },
       totalQuestions: { type: Number, required: true },
       timeTaken: { type: Number, required: true }, // in minutes
       dateTaken: { type: Date, default: Date.now }
   });

   module.exports = mongoose.model('QuizResult', quizResultSchema);
   