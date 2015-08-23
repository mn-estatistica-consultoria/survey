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
    req.flash('success', 'Question created');
    res.redirect('/admin/questions');
  })
  .catch(function(error) {
    req.flash('error', error);
    res.redirect('/admin/questions');
  });
});

router.post('/questions/:id/add', function(req, res, next) {
  models.Response.build({
    QuestionId: req.params.id,
    text: req.body.response_text
  })
  .save()
  .then(function(response) {
    req.flash('success', 'Response created');
    res.redirect('/admin/questions/'+req.params.id);
  })
  .catch(function(error) {
    req.append('error', error);
    res.redirect('/admin/questions/'+req.params.id);
  });
});

module.exports = router;
