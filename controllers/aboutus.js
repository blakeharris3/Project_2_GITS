const express = require("express");
const router = express.Router();

router.get("/", (req, res)=>{
    console.log("this is the Home page for About us")
    res.render("aboutus.ejs", {
        username: req.session.username,
        name: req.session.name,
        logged: req.session.logged,
        id: req.session.id
    })
})

module.exports = router;