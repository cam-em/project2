const express = require("express");
const router = express.Router();
const app = express();
const db = require("../models");
const axios = require("axios");
const moment = require("moment");
const isLoggedIn = require("../middleware/isLoggedIn");

const weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=";

//const city = "Houston";
//const country = "US";
router.use(express.urlencoded({ extended: true }));
router.use(express.static(__dirname + "./public"));

router.get("/", isLoggedIn, async (req, res) => {
    //console.log(process.env.API_KEY);
    const urlParam = req.query.city;
    let tempUnit;
    if (urlParam !== undefined) {
        const city = urlParam.split(",")[0];
        const country = urlParam.split(",")[1];
        console.log(city);
        console.log(country);
        console.log("User ID:" + req.user.id);
        db.user_preferences
            .findOne({ where: { user_id: req.user.id } })
            .then((foundObject) => {
                if (foundObject.measuring_unit === "Fahrenheit") {
                    tempUnit = "imperial";
                } else if (foundObject.measuring_unit === "Celsius") {
                    tempUnit = "metric";
                } else {
                    tempUnit = "imperial";
                }
                console.log("TEMP UNIT TEST: " + tempUnit);
            })
            .then(() =>
                axios
                    .get(
                        `${weatherUrl}${city},${country}&APPID=${process.env.API_KEY}&units=${tempUnit}`
                    )
                    .then((response) => {
                        //Add data API to city database
                        db.city
                            .findOrCreate({
                                where: {
                                    open_weather_map_id: response.data.id,
                                },
                                defaults: {
                                    city_name: response.data.name,
                                    country: response.data.sys.country,
                                },
                            })
                            .catch((err) => console.log(err));
                        console.log(response.data.main.temp);
                        console.log(`open_weather_map_id: ${response.data.id}`);
                        console.log(`city: ${response.data.name}`);
                        console.log(`Country: ${response.data.sys.country}`);
                        res.render("./weather/show.ejs", {
                            data: response.data,
                            moment: moment,
                        });
                    })
            );
        // async function getUnit(id) {
        //     let unit = await db.user_preferences
        //         .findOne({
        //             where: { user_id: id },
        //         })
        //         .then((foundUnit) => {
        //             console.log(
        //                 "TESTING FIRST!!!!!!!" + foundUnit.measuring_unit
        //             );
        //         });
        //     console.log("UNIT CONSOLE LOG IN GETUNIT: " + unit);
        //     return unit;
        // }

        // async function getUnit(id) {
        //     const unit = await db.user_preferences.findByPk(id, {
        //         where: { user_id: id },
        //         raw: true,
        //     });
        //     console.log("UNIT CONSOLE LOG IN GETUNIT: " + unit);
        //     return await unit;
        // }

        // const tempUnit = await getUnit(req.user.id);
        // console.log("TEMP UNIT TEST!!!!!" + tempUnit);
        //Get data from API when search is clicked
        //console.log("TEMP UNIT BEFORE LOADING!!!!---------" + tempUnit);
        // axios
        //     .get(
        //         `${weatherUrl}${city},${country}&APPID=${process.env.API_KEY}&units=${tempUnit}`
        //     )
        //     .then((response) => {
        //         //Add data API to city database
        //         db.city
        //             .findOrCreate({
        //                 where: { open_weather_map_id: response.data.id },
        //                 defaults: {
        //                     city_name: response.data.name,
        //                     country: response.data.sys.country,
        //                 },
        //             })
        //             .catch((err) => console.log(err));
        //         console.log(response.data.main.temp);
        //         console.log(`open_weather_map_id: ${response.data.id}`);
        //         console.log(`city: ${response.data.name}`);
        //         console.log(`Country: ${response.data.sys.country}`);
        //         res.render("./weather/show.ejs", {
        //             data: response.data,
        //             moment: moment,
        //         });
        //     });
    } else {
        res.render("./weather/index.ejs");
    }
    //res.send("THIS WORKS");
});

module.exports = router;
