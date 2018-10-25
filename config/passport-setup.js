const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2')
const GithubStrategy = require('passport-github').Strategy
const keys = require('./keys')
const User = require('../models/users')

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user)
    })
})

passport.use(
    new GoogleStrategy({
        // options for the google strat 
            callbackURL:'/auth/google/redirect',
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret
        }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our database
        User.findOne({googleId: profile.id}).then((currentUser)=> {
            if (currentUser) {
                // already have the user
                console.log('user is ' + currentUser)
                done(null, currentUser)
            } else {
                // if not, create user in our db
                new User({
                    username: profile.displayName,
                    googleId: profile.id,
                    currentDestination: "Earth"

                }).save().then((newUser) => {
                    console.log('new user created: ' + newUser)
                    done(null, newUser)
                })
            }
        })
    })
)

passport.use(
    new GithubStrategy({
        // options for the github strat
        // callbackURL: '/auth/github/redirect',
        clientID: keys.github.clientID,
        clientSecret: keys.github.clientSecret
    }, () => {
        // check if user already exists in our database
        console.log('passport callback function fired')
        User.findOne({
            githubId: profile.id
        }).then((currentUser) => {
            if (currentUser) {
                // already have the user
                console.log('user is ' + currentUser)
                done(null, currentUser)
            } else {
                // if not, create user in our db
                new User({
                    username: profile.displayName,
                    githubId: profile.id,
                    currentDestination: "Earth"

                }).save().then((newUser) => {
                    console.log('new user created: ' + newUser)
                    done(null, newUser)
                })
            }
        })
    })
)


