const express = require("express");
const router = express.Router();
const db = require("../models");
const axios = require("axios");

const weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=";
const city = "Houston";
const country = "US";

router.get("/", (req, res) => {
    //console.log(process.env.API_KEY);
    axios
        .get(`${weatherUrl}${city},${country}&APPID=${process.env.API_KEY}`)
        .then((response) => {
            console.log(response.data);
        });
    res.send("THIS WORKS");
});

module.exports = router;
