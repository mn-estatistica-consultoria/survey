"use strict";

module.exports = function(sequelize, DataTypes) {
  var Response = sequelize.define('Response', {
    text: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Response.belongsTo(models.Question, {
          constraints: false
        });
      }
    }
  });

  return Response;
};