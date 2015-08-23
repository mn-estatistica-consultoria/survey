"use strict";

module.exports = function(sequelize, DataTypes) {
  var QuestionGuest = sequelize.define('QuestionGuest', {}, {
  	timestamps: false,
  	classMethods: {
      associate: function(models) {
        QuestionGuest.belongsTo(models.Response, {
          constraints: false
        });
      }
    }
  });

  return QuestionGuest;
};