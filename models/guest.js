"use strict";

module.exports = function(sequelize, DataTypes) {
  var Guest = sequelize.define('Guest', {
    uuid: DataTypes.STRING,
    ipAddress: DataTypes.STRING,
    userAgent: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Guest.belongsToMany(models.Question, {
          through: {
            model: models.QuestionGuest,
            unique: false
          },
          constraints: false
        });
      }
    }
  });

  return Guest;
};