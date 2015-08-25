var express = require('express');
var router = express.Router();
var models = require('../models');
var bcrypt = require('bcrypt');
var util = require('util');

router.use(function authCheck(req, res, next) {
  // check if an admin user is logged in
  if ( ! req.session.loggedIn) {
    // process login
    if (req.path == '/login' && req.method == 'POST') {
      req.checkBody('username', 'Invalid username.')
        .notEmpty().withMessage('Please enter your username');
      req.checkBody('password', 'Invalid password.')
        .notEmpty().withMessage('Please enter your password');

      var errors = req.validationErrors();

      if ( ! errors) {
        models.User.findOne({
          where: {
            username: req.body.username
          }
        })
        .then(function(user) {
          if ( ! user) {
            req.flash('error', 'Login failed. Username not found.');
            res.redirect('/admin' + req.session.originalPath);
            return;
          }
          
          bcrypt.compare(req.body.password, user.password, function(err, matches) {
            if (matches) {
              console.log('loggin the user in');
              req.session.loggedIn = true;
              req.session.username = user.username;
              req.flash('success', 'Logged in');
            }
            else {
              req.flash('error', 'Login failed. Username or password does not match.');
            }
            res.redirect('/admin' + req.session.originalPath);
          });
        });
        return;
      }

      req.flash('error', 'There have been validation errors: ' + util.inspect(errors));
    }
    else {
      req.session.originalPath = (req.path == '/login') ? '/' : req.path;
    }

    res.render('admin/login');
    return;
  }

  return next();
});

router.get('/logout', function(req, res, next) {
  req.session.loggedIn = false;
  req.session.username = null;
  req.flash('success', 'Logged out.');
  res.redirect('/admin');
});

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
  req.checkBody('question_text', 'Invalid question.')
    .notEmpty().withMessage('Question text is required.');

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', 'There have been validation errors: ' + util.inspect(errors));
    res.redirect('/admin/questions');
    return;
  }

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
  req.checkBody('question_text', 'Invalid question.')
    .notEmpty().withMessage('Question text is required.');

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', 'There have been validation errors: ' + util.inspect(errors));
    res.redirect('/admin/questions/' + req.params.id);
    return;
  }

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
  req.checkBody('response_text', 'Invalid response.')
    .notEmpty().withMessage('Response text is required.');

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', 'There have been validation errors: ' + util.inspect(errors));
    res.redirect('/admin/questions/' + req.params.id);
    return;
  }

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
      id: req.params.responseId
    }
  })
  .then(function() {
    req.flash('success', 'Response has been deleted');
    res.redirect('/admin/questions/' + req.params.id);
  });
});

router.post('/questions/:id/responses/:responseId', function(req, res, next) {
  req.checkBody('response_text', 'Invalid question.')
    .notEmpty().withMessage('Response text is required.');

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', 'There have been validation errors: ' + util.inspect(errors));
    res.redirect('/admin/questions/'+req.params.id);
    return;
  }

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

router.get('/users', function(req, res, next) {
  var page = req.query.page || 1;
  var limit = 5;
  var offset = limit * (page-1);

  models.User.findAndCountAll({
    limit: limit, 
    offset: offset,
    order: 'createdAt desc'
  })
  .then(function(users) {
    var total = users.count;
    var numPages = Math.ceil(total/limit);
    res.render('admin/users', {
      users: users.rows,
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

router.post('/users/add', function(req, res, next) {
  // validation settings
  req.checkBody('username', 'Invalid username.')
    .notEmpty().withMessage('Username is required.')
    .len(6,20).withMessage('Username must be between 6 and 20 characters.');

  req.checkBody('password', 'Invalid password.')
    .notEmpty().withMessage('Password is required.')
    .len(6).withMessage('Password must be at least 6 characters.');

  req.checkBody('password2', 'Invalid password confirmation.')
    .notEmpty().withMessage('Password confirmation is required.');

  var errors = req.validationErrors();

  // check password confirmation
  // express-validator does not provide a rule for comparing 2 different
  // input fields
  if (req.body.password !== req.body.password2) {
    var err = {
      param: 'password',
      msg: 'Password confirmation does not match.',
      value: req.body.password
    };

    if (errors) {
      errors.push(err);
    }
    else {
      errors = [err];
    }
  }

  if (errors) {
    req.flash('error', 'There have been validation errors: ' + util.inspect(errors));
    res.redirect('/admin/users');
    return;
  }

  // hash the password with bcrypt and save it in the database
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      models.User.build({
        username: req.body.username,
        password: hash
      })
      .save()
      .then(function(question) {
        req.flash('success', 'User created');
        res.redirect('/admin/users');
      })
      .catch(function(error) {
        req.flash('error', error);
        res.redirect('/admin/users');
      });
    });
  });
});

router.get('/users/:id/delete', function(req, res, next) {
  if (req.params.id === 1) {
    req.flash('error', 'User "administrator" can not be deleted.');
    res.redirect('/admin/users');
    return;
  }

 models.User.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(function() {
    req.flash('success', 'User has been deleted');
    res.redirect('/admin/users');
  });
});

router.get('/users/validate', function(req, res, next) {
  models.User.findOne({
    where: {
      username: req.query.username
    }
  })
  .then(function(user) {
    if ( ! user) {
      res.sendStatus(200);
    }
    else {
      res.writeHead(400, 'Username is taken.');
      res.send();
    }
  });
});

module.exports = router;
