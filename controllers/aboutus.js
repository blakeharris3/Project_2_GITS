const express = require("express");
const router = express.Router();

router.get("/", (req, res)=>{
    console.log("this is the Home page for About us")
})