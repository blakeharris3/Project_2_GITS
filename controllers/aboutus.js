const express = require("express");
const router = express.Router();
const Ships = require('../models/populateShips');
const Ship = require('../models/ships')


// Ship.collection.insertMany(Ships, (err, res) => {
//     if (err) console.log("No gud");
//     else console.log(res, "this is the res");
// })
router.get("/", async (req, res)=>{
        req.session.lastPage = "About Us"
    try {
        const allShips = await Ship.find();
        console.log("this is the Home page for About us")
        req.session.message = "";
        res.render("aboutus.ejs", {
            ship: allShips,
            username: req.session.username,
            name: req.session.name,
            logged: req.session.logged,
            id: req.session.id
        })
        console.log(allShips, "these are all the ships")
    } catch (err) {
        console.log(err, "this is the error")
    }
    
})

module.exports = router;