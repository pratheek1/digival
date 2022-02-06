'use strict';

const express = require('express');
const router = express.Router();
const controller = require('./examController');

router.post('/createQuestion', controller.createQuestions);
router.get('/getAllQuestions', controller.getAllQuestions);
router.put('/update/:questionId', controller.updateQuestion);
router.delete('/delete/:questionId', controller.deleteQuestion);
router.put('/shuffle/answers/:questionId', controller.shuffleAnswers);

module.exports = router;