var express = require('express');
var router = express.Router();
var models = require('../models');
var uuid = require('uuid');

/* GET home page. */
router.get('/', function(req, res, next) {
  var guestId = req.cookies.remember ? req.cookies.remember : uuid.v1();

  models.Guest.findOrCreate({
    where: {
      uuid: guestId
    }
  })
  .spread(function(guest, created) {
    if (created) {
      guest.set({
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      })
      .save();
      res.cookie('remember', guest.uuid);
    }

    models.sequelize.query('SELECT id FROM Questions WHERE id NOT IN (SELECT QuestionId AS id FROM QuestionGuests WHERE GuestId = ?) ORDER BY RAND() LIMIT 1', {
      replacements: [guest.id],
      type: models.sequelize.QueryTypes.SELECT
    })
    .then(function(questions) {
      if (questions.length <= 0) {
        res.send('You have answered all of the available questions. Please try again later.');
      }
      else {
        models.Question.findById(questions.pop().id)
        .then(function(question) {
          question.getResponses().then(function(responses) {
            res.render('index', {
              question: question,
              responses: responses,
              guest: guest,
              title: question.text
            });
          });
        });
      }
    });
  });

});

router.post('/', function(req, res, next) {
  models.QuestionGuest.build({
    QuestionId: req.body.question_id,
    GuestId: req.body.guest_id,
    ResponseId: req.body.response_id
  })
  .save()
  .then(function(result) {
    req.flash('success', 'Thanks for your response!');
    res.redirect('/');
  });
});

module.exports = router;
