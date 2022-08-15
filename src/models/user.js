const { DataTypes } = require("sequelize");

export let User = "";

export function initDataModels(db) {
  User = db.define(
    "User",
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        // allowNull defaults to true
      },
      nickName: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      desc: {
        type: DataTypes.STRING,
      },
      avatar: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.TIME,
      },
      updatedAT: {
        type: DataTypes.TIME,
      },
    },
    {
      // Other model options go here
    }
  );
}
