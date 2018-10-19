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
        const passwordHash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        await User.create({
            username: req.body.username,
            password: passwordHash,
            email: req.body.email,
            name: req.body.name
        })
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

router.post('/login', async(req, res) => {
    try{
        const foundUser = await User.findOne({username: req.body.username});
        if(foundUser){
            if(bcrypt.compareSync(req.body.password, foundUser.password)){
                req.session.logged = true;
                res.redirect('/')
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












module.exports = router