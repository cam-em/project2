require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const ejsLayouts = require("express-ejs-layouts");
const session = require("express-session");
const passport = require("./config/ppConfig.js");
const flash = require("connect-flash");
const isLoggedIn = require("./middleware/isLoggedIn");
const db = require("./models");

//  setup ejs and ejs layouts
app.set("view engine", "ejs");
app.use(ejsLayouts);

// body parser middleware (this makes req.body work)
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));

// session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// flash middleware
app.use(flash());

// CUSTOM MIDDLEWARE
app.use((req, res, next) => {
    // before every route, attach the flash messsages and current user to res.locals
    // this will give us access to these values in all our ejs pages
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next(); // move on to the next piece of middleware
});

// use controllers
app.use("/auth", require("./controllers/auth.js"));
app.use("/weather", require("./controllers/weather.js"));
app.use("/profile", require("./controllers/profile.js"));

app.get("/", (req, res) => {
    res.redirect("/auth/login");
});

app.listen(process.env.PORT, () => {
    console.log("you're listening to the smooth sounds of port 8000");
});
