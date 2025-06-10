const express = require('express');
const router = express.Router();
const QuizResult = require('../models/QuizResult');
const Question = require('../models/Question');

router.post('/', async (req, res) => {
  try {
    const { questionCount, categories, subcategories } = req.body;

    const totalCount = parseInt(questionCount) || 10;

    // Flatten the category-subcategory pairs
    const categorySubcategoryPairs = [];
    for (const category of categories) {
      const subs = subcategories[category] || [];
      for (const sub of subs) {
        categorySubcategoryPairs.push({ category, subcategory: sub });
      }
    }

    const totalPairs = categorySubcategoryPairs.length;
    if (totalPairs === 0) {
      return res.status(400).json({ message: 'No valid category-subcategory pairs found' });
    }

    const perSubCount = Math.floor(totalCount / totalPairs);
    const remaining = totalCount % totalPairs;

    const questions = [];    

    for (let i = 0; i < categorySubcategoryPairs.length; i++) {
      const pair = categorySubcategoryPairs[i];
      const limit = perSubCount + (i < remaining ? 1 : 0);

      if (limit > 0) {
        const fetched = await Question.aggregate([
          { $match: { category: pair.category, subcategory: pair.subcategory } },
          { $sample: { size: limit } }
        ]);
        questions.push(...fetched);
      }
    }

    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
    try {
        const results = await Question.findOne({});
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
module.exports = router;
     