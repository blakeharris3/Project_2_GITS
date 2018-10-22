const express = require('express');
const router = express.Router();
const destinations = require("../models/destinations")

router.get('/', async(req, res)=>{
const Alldestinations = await destinations.find();
req.session.lastPage = "Destinations"
res.render("planets/index.ejs", {Alldestinations})
})

router.get("/:id", (req, res) => {
    res.send("SHOW PAGE")
})












module.exports = router;