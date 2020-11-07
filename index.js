const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('./config/ppConfig.js')

//  setup ejs and ejs layouts
app.set('view engine', 'ejs')
app.use(ejsLayouts)

// body parser middleware (this makes req.body work)
app.use(express.urlencoded({extended: false}))

// session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// use controllers
app.use('/auth', require('./controllers/auth.js'))

app.get('/', (req, res)=>{
    if(req.user) {
        res.send(`current user: ${req.user.name}`)
    } else {
        res.send('No user currently logged in!')
    }
})

app.listen(8000, ()=>{
    console.log('you\'re listening to the spooky sounds of port 8000')
})