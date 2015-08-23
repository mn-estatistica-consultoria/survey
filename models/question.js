"use strict";

module.exports = function(sequelize, DataTypes) {
  var Question = sequelize.define('Question', {
    text: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Question.belongsToMany(models.Guest, {
          through: {
            model: models.QuestionGuest,
            unique: false
          },
          constraints: false
        });

        Question.hasMany(models.Response, {
          constraints: false
        });
      }
    }
  });

  return Question;
};