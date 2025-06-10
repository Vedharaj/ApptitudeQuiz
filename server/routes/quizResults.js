     const express = require('express');
     const router = express.Router();
     const QuizResult = require('../models/QuizResult');

     router.post('/', async (req, res) => {
         const quizResult = new QuizResult(req.body);
         try {
             const savedResult = await quizResult.save();
             res.status(201).json(savedResult);
         } catch (error) {
             res.status(400).json({ message: error.message });
         }
     });

     router.get('/', async (req, res) => {
         try {
             const results = await QuizResult.find();
             res.json(results);
         } catch (error) {
             res.status(500).json({ message: error.message });
         }
     });

     module.exports = router;
     