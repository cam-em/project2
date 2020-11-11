"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class user_preferences extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.user_preferences.belongsTo(models.user);
        }
    }
    user_preferences.init(
        {
            user_id: DataTypes.INTEGER,
            measuring_unit: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "user_preferences",
        }
    );
    return user_preferences;
};
