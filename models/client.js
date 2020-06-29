'use strict';
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    version: DataTypes.INTEGER,
    force_update: DataTypes.BOOLEAN
  }, {});
  Client.associate = function (models) {
    // associations can be defined here
  };
  return Client;
};