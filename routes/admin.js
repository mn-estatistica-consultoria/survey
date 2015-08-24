var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/', function(req, res, next) {
  models.Question.findAll({
    limit: 5,
    order: 'createdAt desc'
  })
  .then(function(questions) {
    models.Guest.findAll({
      limit: 5,
      order: 'createdAt desc'
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
  var page = req.query.page || 1;
  var limit = 5;
  var offset = limit * (page-1);

  models.Question.findAndCountAll({
    limit: limit,
    offset: offset,
    order: 'id desc'
  })
  .then(function(result) {
    var total = result.count;
    var numPages = Math.ceil(total/limit);
    res.render('admin/questions', {
      questions: result.rows,
      pagination: {
        current: page,
        perPage: limit,
        numPages: numPages,
        hasNextPage: (numPages > page),
        hasPrevPage: (page > 1)
      }
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

router.get('/questions/:id', function(req, res, next) {
  models.Question.findById(req.params.id, {
    include: [{
      model: models.Response
    }]
  })
  .then(function(question) {
    if ( ! question) {
      req.flash('error', 'Question not found');
      res.redirect('/admin/questions');
      return;
    }

    res.render('admin/question', {
      question: question
    });
  })
  .catch(function(error) {
    req.flash('error', error);
    res.redirect('/admin/questions');
  });
});

router.post('/questions/:id', function(req, res, next) {
  models.Question.findById(req.params.id)
    .then(function(question) {
      question.set({
        text: req.body.question_text
      })
      .save()
      .then(function(question) {
        req.flash('success', 'Question ' + question.id + ' has been updated.');
        res.redirect('/admin/questions/' + question.id);
      })
      .catch(function(error) {
        req.flash('error', error);
        res.redirect('/admin/questions/' + question.id);
      });
    });
});

router.get('/questions/:id/results', function(req, res, next) {
  models.Question.findById(req.params.id)
  .then(function(question) {
    if ( ! question) {
      req.flash('error', 'Question not found');
      res.redirect('/admin/questions');
      return;
    }

    models.sequelize.query('select r.text, count(g.id) as totalVotes from Responses r left join QuestionGuests g on r.id = g.ResponseId where r.QuestionId = ? group by r.id order by totalVotes desc', {
      replacements: [question.id],
      type: models.sequelize.QueryTypes.SELECT
    })
    .then(function(responses) {
      res.render('admin/results', {
        question: question,
        responses: responses
      });
    });
  })
  .catch(function(error) {
    req.flash('error', error);
    res.redirect('/admin/questions');
  });
})

router.post('/questions/:id/responses/add', function(req, res, next) {
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
    req.flash('error', error);
    res.redirect('/admin/questions/'+req.params.id);
  });
});

router.get('/questions/:id/delete', function(req, res, next) {
  models.Question.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(function(question) {
    req.flash('success', 'Question has been deleted');
    res.redirect('/admin/questions');
  });
});

router.get('/questions/:id/responses/:responseId/delete', function(req, res, next) {
  models.Response.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(function() {
    req.flash('success', 'Response has been deleted');
    res.redirect('/admin/questions/' + req.params.id);
  });
});

router.post('/questions/:id/responses/:responseId', function(req, res, next) {
  models.Response.findById(req.params.responseId)
    .then(function(response) {
      response.set({
        text: req.body.response_text
      })
      .save()
      .then(function(response) {
        req.flash('success', 'Response has been updated.');
        res.redirect('/admin/questions/' + req.params.id);
      })
      .catch(function(error) {
        req.flash('error', error);
        res.redirect('/admin/questions/' + req.params.id);
      });
    });
});

router.get('/guests', function(req, res, next) {
  var page = req.query.page || 1;
  var limit = 5;
  var offset = limit * (page-1);

  models.Guest.findAndCountAll({
    limit: limit,
    offset: offset,
    order: 'createdAt desc'
  })
  .then(function(guests) {
    var total = guests.count;
    var numPages = Math.ceil(total/limit);
    res.render('admin/guests', {
      guests: guests.rows,
      pagination: {
        current: page,
        perPage: limit,
        numPages: numPages,
        hasNextPage: (numPages > page),
        hasPrevPage: (page > 1)
      }
    });
  });
});

router.get('/guests/:id', function(req, res, next) {
  models.Guest.findById(req.params.id)
    .then(function(guest) {
      models.sequelize.query('select q.id, q.text, r.text as response from Questions q left join QuestionGuests qg on q.id = qg.QuestionId left join Responses r on qg.ResponseId = r.id where qg.GuestId = ? order by q.createdAt desc limit 5', {
        replacements: [guest.id],
        type: models.sequelize.QueryTypes.SELECT
      })
      .then(function(questions) {
        res.render('admin/guest', {
          guest: guest,
          questions: questions
        });
      });
    });
});

module.exports = router;
