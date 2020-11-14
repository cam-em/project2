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

router.get("/", isLoggedIn, (req, res) => {
    //console.log(process.env.API_KEY);
    const urlParam = req.query.city;
    if (urlParam !== undefined) {
        const city = urlParam.split(",")[0];
        const country = urlParam.split(",")[1];
        console.log(city);
        console.log(country);
        console.log("User ID:" + req.user.id);
        //Get data from API when search is clicked
        axios
            .get(
                `${weatherUrl}${city},${country}&APPID=${process.env.API_KEY}&units=imperial`
            )
            .then((response) => {
                //Add data API to city database
                db.city
                    .findOrCreate({
                        where: { open_weather_map_id: response.data.id },
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
            });
    } else {
        res.render("./weather/index.ejs");
    }
    //res.send("THIS WORKS");
});

module.exports = router;
