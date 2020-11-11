"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class user_city extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.user_city.belongsTo(models.user);
            models.user_city.hasMany(models.city);
        }
    }
    user_city.init(
        {
            user_id: DataTypes.INTEGER,
            city_id: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "user_city",
        }
    );
    return user_city;
};
