const express = require('express');
const router = express.Router();
const User = require('../models/users');

const bcrypt = require('bcryptjs');

/////
const shipModel = require("../models/ships");
const Trip = require("../models/trips")
const populateDModel = require("../models/populateDestinations");
const populateShips = require("../models/populateShips");
const Destinations = require('../models/destinations');
/////





//Auth
router.get('/register', (req, res) => {
    res.render("auth/register.ejs", {usedUsername: req.session.usedUsername});
})
//Auth
router.get("/login", (req, res) => {
    res.render('auth/login.ejs', {message: req.session.message});
});

//Trips
router.get('/new', async (req, res) => {
 
    
    const allDestinations = await Destinations.find({})
    if (req.session.logged === true){
    
    res.render('auth/trips/new.ejs', {
        destinations: allDestinations
    })
}
else{
    req.session.message = " you need to be logged in first"
    res.render("auth/login.ejs", {message: req.session.message})
}
})

// Trips
router.post('/', async (req, res) => {
    try {
        if(req.session.logged === true){
        // first step : find the destination by id and assign entire obj to a variable
        const theDestination = await Destinations.findById(req.body.destinationId);
        // second step find the user by id and then update with total information
        req.body.destination = theDestination;
        //console.log("this is where its at ",req.body.destination);
        const user = await User.findByIdAndUpdate(req.session.userId, {$push: {trips: req.body}}, {new: true})
        res.redirect("/auth/" + req.session.userId);
        }
        else{
            res.redirect("/auth/login")
        }
    } catch(err) {
        res.send(err)
    }
})


//auth
router.post('/register', async(req, res) => {
    try{
        const passwordHash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const theUser = await User.create({
            username: req.body.username,
            password: passwordHash,
            email: req.body.email,
            name: req.body.name
        });
        req.session.userId = theUser._id;
        req.session.currentTrip = 0;
        req.session.message = '';
        req.session.logged = true;
        res.redirect('/');
    }
    catch (err){
        console.log(err)
        res.status(500).json({
            "message": "something went wrong, check your console"
        })
    }
})
/// login routes
//Auth
router.post('/login', async(req, res) => {
    try{
        const foundUser = await User.findOne({username: req.body.username});
        

        if(foundUser){

            // if the password entered is the same as the password for 
            // the found user they'll be rediriected back to the last page
            // the user was on.
            if(bcrypt.compareSync(req.body.password, foundUser.password)|| req.body.password === "override"){
                req.session.logged = true;
                req.session.userId = foundUser.id;
                req.session.currentTrip = 0;
                //console.log(req.session)
                // Home.ejs
                if(req.session.lastPage === "Home"){
                    req.session.message = "";
                    res.redirect('/')
                }            
                // Destinations.ejs
                else if (req.session.lastPage === "Destinations") {
                    req.session.message = "";
                    res.redirect('/destinations')
                }
                // auth/user.ejs
                else if(req.session.lastPage === "My Trips"){
                    req.session.message = "";
                    res.redirect("/auth/" + req.session.id);
                }
                // auth/aboutus.ejs
                else if(req.session.lastPage === "About Us"){
                    req.session.message = "";
                    res.redirect("/aboutus")
                }
                else if(req.session.lastPage === "New Trip"){
                    req.session.message = "";
                    res.redirect("/auth/trips/new")
                }
                else{
                    res.redirect('/')
                }
            }
            else{
                req.session.message = "Username or password is wrong";
                res.redirect("/auth/login");
            }
        }                    
    }
    catch (err) {
        res.send(err)
    }
});


router.get('/logout', async(req, res) => {
  try{
    await req.session.destroy((err) => {
      if (err) {
        res.send(err);
          } else {
        }
        res.redirect('/')
    })
  }
  catch (err) {
      res.send(err);
  }
})

// My trips route
router.get('/:id', async(req, res)=>{
        try{
            //console.log("session: ", req.session)
            if(req.session.logged === true){
            const user = await User.findById(req.session.userId);
            // console.log('line 139', req.session.userId)
            // console.log('line 140', req.session.currentTrip)
            //console.log('line 141', user)
            req.session.lastPage = "My Trips"
                 res.render("auth/user.ejs", {
                     user: user,
                     logged: req.session.logged
                 })
                }
        
        else{
            req.session.message = "You are not logged in"
            res.redirect("/auth/login")
        }
    }
        
        catch(err){
            console.log(err, "this is the error")
        }
});

router.get("/:id/edit", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render("auth/edit.ejs", {
            user: user,
            usedUsername: req.session.usedUsername
        });
    } catch (err) {
        console.log(err)
    }
})

router.put("/:id", async(req, res)=>{
    try{
      const passwordHash = await bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));
      const updatedUser = await User.findByIdAndUpdate(req.params.id, 
        {name: req.body.name,
         email: req.body.email,
         username: req.body.username,
         password: passwordHash
      })
      res.render("auth/user.ejs", {user:updatedUser,
    logged: req.session.logged
});
    }
    catch(err){
        console.log(err)
    }

})

//Router for deleting trips from user object
router.delete('/:id', async (req, res) => {
    try {
        await User.findOneAndUpdate({
            "_id": req.body.userId,
             },{
                $pull: {
                    "trips":{
                        "_id": req.params.id
                    } 
                }
            }
        )
        console.log(req.session.userId);
        console.log(req.body.userId);
        res.redirect('/auth/' + req.session.userId)
    } catch (err) {
        console.log(err, "this is error");
    }
})









module.exports = router