const express = require("express");
const router = express.Router();
const app = express();
const db = require("../models");
const axios = require("axios");
const moment = require("moment");
const isLoggedIn = require("../middleware/isLoggedIn");

router.use(express.urlencoded({ extended: true }));
router.use(express.static(__dirname + "./public"));
let measuringUnit;

router.get("/", isLoggedIn, (req, res) => {
    db.user_preferences
        .findOne({ where: { user_id: req.user.id } })
        .then((foundObject) => {
            console.log(foundObject.measuring_unit);
            measuringUnit = foundObject.measuring_unit;
            console.log(measuringUnit);
        })
        .then(()=>{
            res.render("profile", { data: measuringUnit })
        });
    //res.render("profile");
});

router.put("/", isLoggedIn, (req, res) => {
    const measuringUnit = req.body.measuring_unit
    db.user_preferences
        .upsert({
            user_id: req.user.id,
            measuring_unit: req.body.measuring_unit,
        })
        .then(()=>{
            res.render("profile", { data: measuringUnit })
        })
        .catch((err) => {
            console.log(err);
        });
    console.log(req.user.id);
    console.log(req.body.measuring_unit);
    // res.redirect("/profile");
});

module.exports = router;
