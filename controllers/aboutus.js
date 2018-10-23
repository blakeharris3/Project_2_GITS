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
        req.session.message = "";
        res.render("aboutus.ejs", {
            ship: allShips,
            username: req.session.username,
            name: req.session.name,
            logged: req.session.logged,
            id: req.session.id
        })
    } catch (err) {
        res.redirect("/error")

    }
    
})

module.exports = router;