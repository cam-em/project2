const express = require("express");
const router = express.Router();
const app = express();
const db = require("../models");
const axios = require("axios");
const moment = require("moment");
const isLoggedIn = require("../middleware/isLoggedIn");

const weatherUrl = "http://api.openweathermap.org/data/2.5/weather";
const groupUrl = "http://api.openweathermap.org/data/2.5/group"

//const city = "Houston";
//const country = "US";
router.use(express.urlencoded({ extended: true }));
router.use(express.static(__dirname + "./public"));





router.get("/", isLoggedIn, async (req, res) => {

    //console.log(process.env.API_KEY);
    const urlParam = req.query.city;
    //If there's no search just load generic search page
    //If there's a URL param, load the show.ejs with the following data
    if (urlParam !== undefined) {
        const city = urlParam.split(",")[0];
        const country = urlParam.split(",")[1];
        let tempUnit;
        let tempUnitAbreviation;
        console.log(city);
        console.log(country);
        console.log("User ID:" + req.user.id);
        // Load the user preferences and check whether it's Celsius or Fahrenheit
        // If there's no preference selected, load Fahrenheit by default
        db.user_preferences
            .findOne({ where: { user_id: req.user.id } })
            .then((foundObject) => {
                console.log(foundObject);
                if (foundObject.measuring_unit === "Fahrenheit") {
                    tempUnit = "imperial";
                    tempUnitAbreviation = "F";
                } else if (foundObject.measuring_unit === "Celsius") {
                    tempUnit = "metric";
                    tempUnitAbreviation = "C";
                } else {
                    tempUnit = "imperial";
                    tempUnitAbreviation = "F";
                }
                console.log("TEMP UNIT TEST: " + tempUnit);
            })
            .then(() => {
            //Pull weather data from API w/ city given in urlParam
                axios
                    .get(
                        `${weatherUrl}?q=${city},${country}&APPID=${process.env.API_KEY}&units=${tempUnit}`
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
                            abbreviation: tempUnitAbreviation,
                        });
                    })
                })
    } else {
        res.render("./weather/index.ejs");
    }
});

router.post("/favorites", isLoggedIn, (req, res) => {
    console.log("Favorite test route: " + req.user.id);
    db.user_city
        .findOrCreate({
            where: { user_id: req.user.id, city_id: req.body.city_id },
        })
        .catch((err) => {
            console.log(err);
        });
    console.log("body: %j", req.body.city_id);
    res.redirect("/weather/favorites");
});

router.get("/favorites", isLoggedIn, (req, res) => {
    cityDataArray = []
    let tempUnit;
    let tempUnitAbreviation;

    db.user_preferences
    .findOne({ where: { user_id: req.user.id } })
    .then((foundObject) => {
        console.log(foundObject);
        if (foundObject.measuring_unit === "Fahrenheit") {
            tempUnit = "imperial";
            tempUnitAbreviation = "F";
        } else if (foundObject.measuring_unit === "Celsius") {
            tempUnit = "metric";
            tempUnitAbreviation = "C";
        } else {
            tempUnit = "imperial";
            tempUnitAbreviation = "F";
        }
        console.log("TEMP UNIT TEST: " + tempUnit);
    })
    .then(()=>{
        db.user_city
            .findAll({ where: { user_id: req.user.id } })
            .then((foundObjects) => {
                console.log("FOUND OBJECTS", foundObjects)
                const cityIdsArray = foundObjects.map((obj) => {
                    return obj.city_id
                })
                const cityIds = cityIdsArray.toString()
                console.log("CITY IDS STRING", cityIds)
                    axios.get(`${groupUrl}?id=${cityIds}&APPID=${process.env.API_KEY}&units=${tempUnit}`)
                        .then((cityData) => {
                            console.log(cityData.data.list)
                            res.render("./weather/favorites.ejs", {
                                data: cityData.data.list,
                                moment: moment,
                                abbreviation: tempUnitAbreviation,
                        })
                });
            });
        })
});

module.exports = router;
