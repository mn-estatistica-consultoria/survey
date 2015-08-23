var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
  models.Question.findOne({
    order: 'rand()'
  })
  .then(function(question) {
    question.getResponses().then(function(responses) {
      res.render('index', {
        question: question,
        responses: responses
      });
    });
  });
});

module.exports = router;
