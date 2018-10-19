const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcryptjs');

router.get('/register', (req, res) => {
    res.render("auth/register.ejs", {usedUsername: req.session.usedUsername});
})

router.get("/login", (req, res) => {
    res.render('auth/login.ejs', {message: req.session.message});
});

router.post('/register', async(req, res) => {
    try{
        const password = req.body.password;
        const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        const userEntry = {};
        userEntry.username = req.body.username;
        userEntry.password = passwordHash;
        userEntry.email = req.body.email;
        userEntry.name = req.body.name;
        req.session.username = req.body.username;
        await User.create(userEntry);
        req.session.logged = true;
        req.session.message = '';
        res.redirect('/auth/login');
    }
    catch (err){
        res.send(err)
    }
})

router.post('/login', async(req, res) => {
    try{
        const foundUser = await User.findOne({ username: req.body.username});
        if(foundUser){
            if(bcrypt.compareSync(req.body.password, foundUser.password)){
            res.render('home.ejs', {session: req.session.logged})
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

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.send(err);
        }
        else{
            res.redirect('/')
        }
    })
})












module.exports = router