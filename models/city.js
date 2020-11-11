"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class city extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.city.belongsToMany(models.user_city, { through: city });
        }
    }
    city.init(
        {
            open_weather_map_id: {
                type: DataTypes.INTEGER,
                unique: true,
            },
            city_name: DataTypes.STRING,
            state: DataTypes.STRING,
            country: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "city",
        }
    );
    return city;
};
