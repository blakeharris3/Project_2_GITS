const express = require('express');
const router = express.Router();

router.get("/", (req, res) =>{
    res.send("hEyy THerE")
})

router.get("/:id", (req, res) => {
    res.send("SHOW PAGE")
})












module.exports = router