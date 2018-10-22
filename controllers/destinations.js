const express = require('express');
const router = express.Router();
const destinations = require("../models/destinations")

router.get('/', async(req, res)=>{
const Alldestinations = await 
req.session.lastPage = "Destinations"
res.render("planets/index.ejs", {})

router.get("/", (req, res) =>{
    res.send("hEyy THerE")
})

router.get("/:id", (req, res) => {
    res.send("SHOW PAGE")
})












module.exports = router