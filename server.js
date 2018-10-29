    ////////////////////////////////////////////////////////////////////////////////
   /////////////////                              /////////////////////////////////
  /////////////////  Requires and controllers    /////////////////////////////////
 /////////////////                              /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
//const keys = require('./config/keys'); // For local emvironment
const passport = require('passport');
const _ = require('underscore');


const Destinations = require('./models/destinations');

const authController = require("./controllers/authAndTrips");
const destinationsController = require('./controllers/destinations');
const aboutUsController = require('./controllers/aboutus')


const keys = process.env.COOKIEKEY || 'cache me outside!'



const app = express();
const port = process.env.PORT || 3000; //two routes


// process.env exists inside of a node server
// process.env exists inside of a node server

require('./db/db');

    ////////////////////////////////////////////////////////////////////////////////
   /////////////////                 ///////////////////////////////////////////////
  /////////////////   Middleware    //////////////////////////////////////////////
 /////////////////                 ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
app.use(session({
    secret: 'what is this', // This article explains the secret key very well: https://martinfowler.com/articles/session-secret.html
    resave: false,
    saveUninitialized: false,
    maxAge: 24 * 60 * 60 * 1000,
     //keys: [keys.session.cookieKey]
    keys: [keys]
}))

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
//////////  See Controllers    /////////////////
app.use("/auth", authController);
app.use("/destinations", destinationsController);
app.use("/aboutus", aboutUsController);



app.use("/error", (req, res) => {
    res.render("error.ejs")
})


////////////   Home     ////////////////////
app.get('/', async(req, res) =>{
  
  try{
    let allDestinations = await Destinations.find();
    allDestinations = _.sample(_.shuffle(allDestinations), 3)
    req.session.lastPage = "Home"
    req.session.message = "";
    await res.render("home.ejs", {
        destinations: allDestinations,
        username: req.session.username,
      name: req.session.name,
      logged : req.session.logged,
      id: req.session.id})
    }
  catch(err){
      console.log(err)
    res.redirect("/error")

}
});

app.listen(port, ()=>{
    console.log(`i can hear you on port: ${port}`);
});


/* Excellent job with your server.js file.
 * This is something you would probably want to clean up a bit in terms of 
 * removing all commented-out code or code that's being unusued.
 */