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
<<<<<<< HEAD
        const password = req.body.password;
        const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        const userEntry = {};
        userEntry.username = req.body.username;
        userEntry.password = passwordHash;
        userEntry.email = req.body.email;
        userEntry.name = req.body.name;
        userEntry.curentTrip = 0;

        const user = await User.create(userEntry);
        req.session.id = user._id;
        req.session.lastPage = "register";        
=======
        const passwordHash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        await User.create({
            username: req.body.username,
            password: passwordHash,
            email: req.body.email,
            name: req.body.name
        })
>>>>>>> 871a26c86d85d38697d4f844374dd934c9eff2ca
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


/// login routes
router.post('/login', async(req, res) => {
    try{
        const foundUser = await User.findOne({username: req.body.username});
        if(foundUser){
            if(bcrypt.compareSync(req.body.password, foundUser.password)){
                req.session.logged = true;
                if(req.session.lastPage === "Home"){
                res.redirect('/')
                }
                else if(req.session.lastPage === "Destinations"){
                    res.redirect('/destinations')
                }
                else if(req.session.lastPage === "My Trips"){
                    res.redirect("/auth/" + req.session.id);
                }
                else if(req.session.session.lastPage === "About Us"){
                    res.redirect("/aboutus")
                }
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

// My trips route
router.get('/:id', async(req, res)=>{
        try{
            const user = await findById(req.params.id);
            req.session.lastPage = "My Trips"
            res.render("user.ejs", {
                user
            })
        }
        catch(err){
            console.log(err)
        }
});

router.get("/:id/0", async(req, res)=>{
    try{
        const user = await findById(req.params.id);
      await req.session.curentTrip--;
      res.render("user.ejs", {user})
    }
    catch(err){
        console.log(err)
    }
})

router.get("/:id/1", async (req, res) => {
    try {
        const user = await findById(req.params.id);
        await req.session.curentTrip++;
        res.render("user.ejs", { user })
    }
    catch (err) {
        console.log(err)
    }
})











module.exports = router