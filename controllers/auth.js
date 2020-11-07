const express = require('express')
const router = express.Router()
const db = require('../models')
const passport = require('../config/ppConfig.js')

router.get('/signup', (req, res)=>{
    res.render('auth/signup')
})

router.post('/signup', (req, res)=>{
    console.log('sign up form user input:', req.body)
    // if it does, throw an error message
    // otherwise create a new user and store them in the db
    db.user.findOrCreate({ // check if that email is already in db
        where: {email: req.body.email},
        defaults: {name: req.body.name, password: req.body.password}
    }) // create new user if email wasn't found
    .then(([createdUser, wasCreated])=>{
        if(wasCreated){
            console.log(`just created the following user:`, createdUser)
        } else {
            console.log(' An account associated with that email address already exists! Try loggin in.')
        }
        // redirect to login page
        res.redirect('/auth/login')
    })
    .catch(err=>{
        console.log('Did not post to db!!! See error>>>>>>>>', err)
    })
})

router.get('/login', (req, res)=>{
    res.render('auth/login')
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    successRedirect: '/'
}))

module.exports = router