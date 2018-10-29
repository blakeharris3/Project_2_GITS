const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2')
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
        callbackURL: '/auth/google/redirect',
        clientID: process.env.CLIENT_ID || keys.google.clientID,
        clientSecret: process.env.CLIENT_SECRET || keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our database
        User.findOne({
            googleId: profile.id
        }).then((currentUser) => {
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

/* Nice work getting this set up!
 * Thanks for adding comments in your code to explain what each portion of your
 * code does!
 */