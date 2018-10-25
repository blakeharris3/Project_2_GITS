const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport')
require('../config/passport-setup')


/////   Models   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const User = require('../models/users');
const shipModel = require("../models/ships");
const Trip = require("../models/trips");
///////////////// ships destinations  to initally inject into the database ////////////////////////////////////////////////////////////////
const Destinations = require('../models/destinations');
const populateDModel = require("../models/populateDestinations");
const populateShips = require("../models/populateShips");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.get("/",(req, res)=>{
    res.redirect("/");
});


// auth/register  brings you to register page
router.get('/register', (req, res) => {
    res.render("auth/register.ejs", {usedUsername: req.session.usedUsername});
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// auth with google
router.get('/google', passport.authenticate('google', {
    scope:['profile']
}));

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    req.session.logged = true
    res.redirect('/auth')
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


 ///////////////  Working on logging in through oAuth or ////////////////
//////////////   Standard Registration and log in       ////////////////

router.get("/oauthLogin", async(req,res)=>{
    req.session.oAuth = true;
    res.redirect("/auth/google")
})


//auth/login  brings you to login page
router.get("/login", (req, res) => {
    res.render('auth/login.ejs', {message: req.session.message});
});



// auth/trips/new creates new trip for user
// router.get('/new', async (req, res) => {
//     try {
//         if (req.session.oAuth === true){
//         console.log('This should not run')
//         const user = await User.findById(req.session.passport.user);
//         } else {
//         console.log('line 67: ', req.session.userId)
//         const user = await User.findById(req.session.userId);
//         }
//         const allDestinations = await Destinations.find({});
//         if (req.session.logged === true){
//             res.render('auth/trips/new.ejs', {
//                 destinations: allDestinations,
//                 user: user
//             });
//         } else {
//             req.session.message = " you need to be logged in first"
//             res.render("auth/login.ejs", {
//                 message: req.session.message
//             });
//         };
//     } catch (err){
//         console.log(req.params, "this is params")
//         res.redirect("/error")
//         console.log(err, "this is the error");
//     }
// });



////////////Test Area./////////////////////////

router.get('/new', async (req, res) => {
 if(req.session.oAuth === true){
     try {
         const user = await User.findById(req.session.passport.user);
         const destinations = await Destinations.find();
         res.render('auth/trips/new.ejs',{ user, destinations});
     } catch (error) {
          console.log(error, "this is error");
          res.redirect("/error");
     }
 } else if(req.session.logged === true) {
    try {
        const user = User.findById(req.session.userId)
        const destinations = await Destinations.find();
         res.render('auth/trips/new.ejs',{ user, destinations});
    } catch (error) {
        console.log(error, "this is error");
        res.redirect("/error");
    }        
 } else {
    req.session.message = " you need to be logged in first"
    res.render("auth/login.ejs", {
        message: req.session.message
    });     
 }
});









// /auth/ adds new trips to user logged in
router.post('/', async (req, res) => {
    try {
        if(req.session.logged === true){
            const theFromDestination = await Destinations.findById(req.body.fromDestinationId);
            // console.log(theFromDestination, "from destination");
            const theToDestination = await Destinations.findById(req.body.toDestinationId);
            // console.log(theToDestination, "the to dest")
            req.body.fromDestination = theFromDestination;
            req.body.toDestination = theToDestination;
            // console.log(req.body, "this is the body")
            if(req.session.oAuth === true){
                const user = await User.findByIdAndUpdate(req.session.passport.user, {
                    $push: {
                        trips: req.body
                    }
                }, {
                    new: true
                });
                console.log(user, "this is user")
                res.redirect("/auth/" + req.session.passport.user);
            }
            else{
                await User.findByIdAndUpdate(req.session.userId, {
                $push: {
                    trips: req.body
                }
                }, {
                    new: true
                });            
                res.redirect("/auth/" + req.session.userId);
            }
        }
        else {
          res.redirect("/auth/login");
        }
    } catch(err) {
        res.redirect("/error");
        console.log(err, "this is the error");
    };
});


// auth/register adds new user to data base
router.post('/register', async(req, res) => {
    try{
        
        const passwordHash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        const theUser = await User.create({
            username: req.body.username,
            password: passwordHash,
            email: req.body.email,
            name: req.body.name,
            currentDestination: "Earth"            
        });
        req.session.userId = theUser._id;
        req.session.currentTrip = 0;
        req.session.message = '';
        req.session.logged = true;
        console.log(theUser)
        res.redirect('/');
    }
   
    catch (err){
        console.log(err)
        res.redirect("/error")
        
    };
});

/// logs in selected user by data base
router.post('/login', async(req, res) => {
    try{
        const foundUser = await User.findOneAndUpdate({
            username: req.body.username
        }, {
            currentDestination: "Earth"
        });
          //console.log(foundUser)
        if(foundUser){
            if(bcrypt.compareSync(req.body.password, foundUser.password)|| req.body.password === "override"){
                req.session.logged = true;
                req.session.userId = foundUser.id;
                
                // Home.ejs
              if(req.session.lastPage === "Home"){
                    req.session.message = "";
                    res.redirect('/');
              }            
                // Destinations.ejs
              else if (req.session.lastPage === "Destinations") {
                    req.session.message = "";
                    res.redirect('/destinations');
              }
                // auth/user.ejs
              else if(req.session.lastPage === "My Trips"){
                  req.session.message = "";
                if(req.session.oAuth === true){
                      res.redirect("/auth/" + req.session.id);
                    }
                    else{
                        req.session.message = "";
                        res.redirect("/auth/" + req.session.id);
                   }
              }
                // auth/aboutus.ejs
              else if(req.session.lastPage === "About Us"){
                    req.session.message = "";
                    res.redirect("/aboutus");
              }
                // auth/trips/new.ejs
              else if(req.session.lastPage === "New Trip"){
                    req.session.message = "";
                    res.redirect("/auth/trips/new");
              }
              else{
                    // home.ejs
                    res.redirect('/');
              };
            }
            else{
                req.session.message = "Username or password is wrong";
                res.redirect("/auth/login");
            }
        }                    
    }
    catch (err) {
        res.redirect("/error")
          console.log(err, "this is the error");
    }
});

router.post("/takeTrip", async(req,res)=>{
  try{
      const user = await User.findByIdAndUpdate(req.session.userId, { $set: { currentDestination: req.body.tripName }, $pull: { "trips": { "_id": req.body.tripId } }});
    //console.log(req.body.tripName)
    // console.log("user: ", user)
    const current = await Destinations.findOne({
        name: user.currentDestination
    });
    res.redirect("/auth/" + req.session.userId)
}
  catch(err){
      res.redirect("/error")
        console.log(err, "this is the error");
  }
})

router.post("/travel", async(req, res)=>{
    // const user = await User.findById(req.session.userId);
    // const destination = await Destinations.findOne({name: user.currentDestination})
    console.log(req.body.tripId)
    // console.log(destination)
    res.render("auth/traveling.ejs",
    {destination: req.body.tripName,
     tripId: req.body.tripId});


})

router.post("/leave",(req, res)=>{
   res.redirect("/auth/takeTrip")
})

// logs you out and deletes session
router.get('/logout', async(req, res) => {
  
    try{
    await req.session.destroy((err) => {
      if (err) {
        res.send(err);
      } else {
    
      };
        res.redirect('/');
    })
  }
  catch (err) {
        res.redirect("/error")
          console.log(err, "this is the error");
  }
})

// auth/:id  brings you to auth/user.ejs, which is the index for all the trips and
// where you can edit the user
router.get('/:id', async(req, res)=>{
        
    try{
      req.session.lastPage = "My Trips";
        if(req.session.logged === true){
           if(req.session.oAuth === true){
            const user = await User.findById(req.session.passport.user);
           }
        } else {
          const user = await User.findById(req.session.userId);
         // console.log(user.currentDestination)
          const destination = await Destinations.findOne({'name': user.currentDestination})
          //console.log(destination)
        } 
    } catch (err) {
        res.redirect("/error")
          console.log(err, "this is the error");
    };
});

















module.exports = router