    ////////////////////////////////////////////////////////////////////////////////
   /////////////////                              /////////////////////////////////
  /////////////////  Requires and controllers    /////////////////////////////////
 /////////////////                              /////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");

const authController = require("./controllers/auth");
const destinationsController = require('./controllers/destinations');
const tripsController = require('./controllers/trips');

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
    saveUninitialized: false
}))
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
//////////  See Controllers    /////////////////
app.use("/auth", authController);
app.use("/destinations", destinationsController);
app.use("/trips", tripsController);

app.use('/', (req, res) =>{
  
  

    res.render("home.ejs", {username: req.session.username,
    name: req.session.name,
  logged : req.session.logged})
});




app.listen(port, ()=>{
    console.log(`i can hear you on port: ${port}`);
});
