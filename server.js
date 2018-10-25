    ////////////////////////////////////////////////////////////////////////////////
   /////////////////                              /////////////////////////////////
  /////////////////  Requires and controllers    /////////////////////////////////
 /////////////////                              /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const keys = require('./config/keys')
const passport = require('passport')




const authController = require("./controllers/authAndTrips");
const destinationsController = require('./controllers/destinations');
const aboutUsController = require('./controllers/aboutus')






const app = express();
const port = 3000;
require('./db/db');

    ////////////////////////////////////////////////////////////////////////////////
   /////////////////                 ///////////////////////////////////////////////
  /////////////////   Middleware    //////////////////////////////////////////////
 /////////////////                 ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
app.use(session({
    secret:'what is this',
    resave: false,
    saveUninitialized: false,
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
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
app.use('/', async(req, res) =>{
  
  try{
      
    req.session.lastPage = "Home"
    req.session.message = "";
    await res.render("home.ejs", {username: req.session.username,
      name: req.session.name,
      logged : req.session.logged,
      id: req.session.id})
    }
  catch(err){
    res.redirect("/error")

}
});

app.listen(port, ()=>{
    console.log(`i can hear you on port: ${port}`);
});

