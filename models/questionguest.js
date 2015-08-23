"use strict";

module.exports = function(sequelize, DataTypes) {
  var QuestionGuest = sequelize.define('QuestionGuest', {
    response_id: DataTypes.INTEGER
  });

  return QuestionGuest;
};