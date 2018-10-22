const express = require('express');
const router = express.Router();
const destinations = require("../models/destinations")

router.get('/', async(req, res)=>{
const Alldestinations = await 
req.session.lastPage = "Destinations"
res.render("planets/index.ejs", {})
})













module.exports = router