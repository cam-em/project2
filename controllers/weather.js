const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/", (req, res) => {
    res.send("THIS WORKS");
});

module.exports = router;
