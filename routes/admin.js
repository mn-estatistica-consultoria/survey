var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/', function(req, res, next) {
  models.Question.findAll({
    limit:5
  })
  .then(function(questions) {
    models.Guest.findAll({
      limit:5
    })
    .then(function(guests) {
      res.render('admin/index', {
        questions: questions,
        guests: guests
      });
    });
  });
});

router.get('/questions', function(req, res, next) {
  models.Question.findAndCountAll({
    limit: 10,
    order: 'id desc'
  })
  .then(function(result) {
    res.render('admin/questions', {
      questions: result.rows
    });
  });
});

router.get('/questions/:id', function(req, res, next) {
  models.Question.findById(req.params.id, {
    include: [{
      model: models.Response
    }]
  })
    .then(function(question) {
      res.render('admin/question', {
        question: question
      });
    });
});

router.post('/questions/add', function(req, res, next) {
  models.Question.build({
    text: req.body.question_text
  })
  .save()
  .then(function(question) {
    res.append('success', 'Question created')
      .redirect('/admin/questions');
  })
  .catch(function(error) {
    res.append('error', error)
      .redirect('/admin/questions');
  });
});

router.post('/questions/:id/add', function(req, res, next) {
  models.Response.build({
    question_id: req.params.id,
    text: req.body.response_text
  })
  .save()
  .then(function(response) {
    res.append('success', 'Response created')
      .redirect('/admin/questions/'+req.params.id);
  })
  .catch(function(error) {
    res.append('error', error)
      .redirect('/admin/questions/'+req.params.id);
  });
});

module.exports = router;
