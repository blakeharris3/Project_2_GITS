const express = require('express');
const router = express.Router();
const User = require('../models/users');

const bcrypt = require('bcryptjs');

/////
const shipModel = require("../models/ships");
const tripModel = require("../models/trips")

const populateDModel = require("../models/populateDestinations");
const populateShips = require("../models/populateShips");
const Destinations = require('../models/destinations');
/////

router.get('/register', (req, res) => {
    res.render("auth/register.ejs", {usedUsername: req.session.usedUsername});
})

router.get("/login", (req, res) => {
    res.render('auth/login.ejs', {message: req.session.message});
});

router.get('/new', async (req, res) => {
    const allDestinations = await Destinations.find({})
    res.render('auth/trips/new.ejs', {
        destinations: allDestinations
    })
})

router.post('/register', async(req, res) => {
    try{
        const passwordHash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const destinations = await Destinations.collection.insertMany(populateDModel);
        const ships = await shipModel.collection.insertMany(populateShips);

        for (let i = 0; i < ships.length; i++) {
            destinations[i].findOneAndUpdate({
                ships
            }, {
                ships: ships[i]
            }, (err, updated) => {
                if (err) console.log(err)
                else console.log(updated)
            })
        }

        const trip = tripModel.create({
            name: "it works",
            destination: destinations[0],
            ticketQty: 1,
            luggageQty: 30
        })
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        await User.create({
            username: req.body.username,
            password: passwordHash,
            email: req.body.email,
            name: req.body.name,
            trips: trip
        });
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
router.post('/login', async(req, res) => {
    try{
        const foundUser = await User.findOne({username: req.body.username});
        if(foundUser){

            // if the password entered is the same as the password for 
            // the found user they'll be rediriected back to the last page
            // the user was on.
            if(bcrypt.compareSync(req.body.password, foundUser.password)){
                req.session.logged = true;

                // Home.ejs
                if(req.session.lastPage === "Home"){
                res.redirect('/')
                }
                
                // Destiantions.ejs
                else if(req.session.lastPage === "Destinations"){
                    res.redirect('/destinations')
                }

                // auth/user.ejs
                else if(req.session.lastPage === "My Trips"){
                    res.redirect("/auth/" + req.session.id);
                }

                // auth/aboutus.ejs
                else if(req.session.lastPage === "About Us"){
                    res.redirect("/aboutus")
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
            const user = await findById(req.params.id);
            req.session.lastPage = "My Trips"
            res.render("user.ejs", {
                user
            })
        }
        catch(err){
            console.log(err)
        }
});

router.get("/:id/0", async(req, res)=>{
    try{
        const user = await findById(req.params.id);
      await req.session.curentTrip--;
      res.render("user.ejs", {user})
    }
    catch(err){
        console.log(err)
    }
})

router.get("/:id/1", async (req, res) => {
    try {
        const user = await findById(req.params.id);
        await req.session.curentTrip++;
        res.render("user.ejs", { user })
    }
    catch (err) {
        console.log(err)
    }
})











module.exports = router