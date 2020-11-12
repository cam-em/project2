const express = require("express");
const router = express.Router();
const app = express();
const db = require("../models");
const axios = require("axios");
const isLoggedIn = require("../middleware/isLoggedIn");

const weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=";
//const city = "Houston";
//const country = "US";
router.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
    //console.log(process.env.API_KEY);
    const urlParam = req.query.city;
    console.log(req.body);
    if (urlParam !== undefined) {
        const city = urlParam.split(",")[0];
        const country = urlParam.split(",")[1];
        console.log(city);
        console.log(country);
        axios
            .get(`${weatherUrl}${city},${country}&APPID=${process.env.API_KEY}`)
            .then((response) => {
                console.log(response.data);
                res.render("./weather/show.ejs", { data: response.data });
            });
    }
    res.render("./weather/index.ejs");
    //res.send("THIS WORKS");
});

router.post("/", (req, res) => {
    console.log(req.body.city);
    res.send("TESTING");
});

module.exports = router;
