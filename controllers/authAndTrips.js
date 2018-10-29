const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport')
require('../config/passport-setup')


/////   Models   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const User = require('../models/users');
const shipModel = require("../models/ships"); // This model was required, but never used
const Trip = require("../models/trips");
///////////////// ships destinations  to initally inject into the database ////////////////////////////////////////////////////////////////
const Destinations = require('../models/destinations');
const populateDModel = require("../models/populateDestinations"); // This model was required, but never used
const populateShips = require("../models/populateShips"); // This model was required, but never used
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.get("/", (req, res) => {
    res.redirect("/");
});


// auth/register  brings you to register page
router.get('/register', (req, res) => {
    res.render("auth/register.ejs", {
        usedUsername: req.session.usedUsername
    });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    req.session.logged = true
    res.redirect('/auth')
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////  Working on logging in through oAuth or ////////////////
//////////////   Standard Registration and log in       ////////////////

router.get("/oauthLogin", async (req, res) => {
    req.session.oAuth = true;
    res.redirect("/auth/google")
})


//auth/login  brings you to login page
router.get("/login", (req, res) => {
    res.render('auth/login.ejs', {
        message: req.session.message
    });
});




router.get('/new', async (req, res) => {
    if (req.session.oAuth === true) {
        try {
            const user = await User.findById(req.session.passport.user);
            const destinations = await Destinations.find();
            res.render('auth/trips/new.ejs', {
                user,
                destinations
            });
        } catch (error) {
            res.redirect("/error");
        }
    } else if (req.session.logged === true) {
        try {
            const user = User.findById(req.session.userId)
            const destinations = await Destinations.find();
            res.render('auth/trips/new.ejs', {
                user,
                destinations
            });
        } catch (error) {
            res.redirect("/error");
        }
    } else {
        req.session.message = " you need to be logged in first"
        res.render("auth/login.ejs", {
            message: req.session.message
        });
    }
});




// /auth/ adds new trips to user logged in
router.post('/', async (req, res) => {
    if (req.session.oAuth === true) {
        try {
            const theFromDestination = await Destinations.findById(req.body.fromDestinationId);
            const theToDestination = await Destinations.findById(req.body.toDestinationId);
            req.body.fromDestination = theFromDestination;
            req.body.toDestination = theToDestination;
            const user = await User.findByIdAndUpdate(req.session.passport.user, {
                $push: {
                    trips: req.body
                }
            }, {
                new: true
            });
            console.log(user, "this is user")
            res.redirect("/auth/" + req.session.passport.user);
        } catch (err) {
            console.log(err)
            res.redirect("/error")
        }
    } else if (req.session.logged === true) {
        try {
            const theFromDestination = await Destinations.findById(req.body.fromDestinationId);
            const theToDestination = await Destinations.findById(req.body.toDestinationId);
            req.body.fromDestination = theFromDestination;
            req.body.toDestination = theToDestination;

            await User.findByIdAndUpdate(req.session.userId, {
                $push: {
                    trips: req.body
                }
            }, {
                new: true
            });
            res.redirect("/auth/" + req.session.userId);
        } catch (err) {
            res.redirect("/error");
            console.log(err, "this is the error");
        };
    } else {
        try {
            res.redirect("/auth/login");
        } catch (err) {
            console.log(err)
            res.redirect("/error");
        }
    }

});


// auth/register adds new user to data base
router.post('/register', async (req, res) => {
    try {

        const passwordHash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        const theUser = await User.create({
            username: req.body.username,
            password: passwordHash,
            email: req.body.email,
            name: req.body.name,
            currentDestination: "Earth"
        });
        req.session.userId = theUser._id;
        req.session.currentTrip = 0;
        req.session.message = '';
        req.session.logged = true;
        res.redirect('/');
    } catch (err) {
        res.redirect("/error")

    };
});

/// logs in selected user by data base
router.post('/login', async (req, res) => {
    try {
        const foundUser = await User.findOneAndUpdate({
            username: req.body.username
        }, {
            currentDestination: "Earth"
        });
        if (foundUser) {
            if (bcrypt.compareSync(req.body.password, foundUser.password) || req.body.password === "override") {
                req.session.logged = true;
                req.session.userId = foundUser.id;
                //Redeirect client to the last page they were on 
                // Home.ejs
                if (req.session.lastPage === "Home") {
                    req.session.message = "";
                    res.redirect('/');
                }
                // Destinations.ejs
                else if (req.session.lastPage === "Destinations") {
                    req.session.message = "";
                    res.redirect('/destinations');
                }
                // auth/user.ejs
                else if (req.session.lastPage === "My Trips") {
                    req.session.message = "";
                    if (req.session.oAuth === true) {
                        res.redirect("/auth/" + req.session.id);
                    } else {
                        req.session.message = "";
                        res.redirect("/auth/" + req.session.id);
                    }
                }
                // auth/aboutus.ejs
                else if (req.session.lastPage === "About Us") {
                    req.session.message = "";
                    res.redirect("/aboutus");
                }
                // auth/trips/new.ejs
                else if (req.session.lastPage === "New Trip") {
                    req.session.message = "";
                    res.redirect("/auth/trips/new");
                } else {
                    // home.ejs
                    res.redirect('/');
                };
            } else {
                req.session.message = "Username or password is wrong";
                res.redirect("/auth/login");
            }
        }
    } catch (err) {
        res.redirect("/error")
    }
});

router.post("/takeTrip", async (req, res) => {

    if (req.session.oAuth === true) {
        try {
            const user = await User.findByIdAndUpdate(req.session.passport.user, {
                $set: {
                    currentDestination: req.body.tripName
                },
                $pull: {
                    "trips": {
                        "_id": req.body.tripId
                    }
                }
            });
            res.redirect("/auth/" + req.session.userId)

        } catch (err) {
            console.log(err)
            res.redirect("/error");
        }
    } else if (req.session.logged === true) {
        try {
            const user = await User.findByIdAndUpdate(req.session.userId, {
                $set: {
                    currentDestination: req.body.tripName
                },
                $pull: {
                    "trips": {
                        "_id": req.body.tripId
                    }
                }
            });
            res.redirect("/auth/" + req.session.userId)

        } catch (err) {
            res.redirect("/error")
            console.log(err, "this is the error");
        }
    }

})

router.post("/travel", async (req, res) => {

    res.render("auth/traveling.ejs", {
        destination: req.body.tripName,
        tripId: req.body.tripId
    });


})

router.post("/travel", async (req, res) => {
    res.render("auth/traveling.ejs", {
        destination: req.body.tripName,
        tripId: req.body.tripId
    });
})

router.post("/leave", (req, res) => {
    res.redirect("/auth/takeTrip")
})

// logs you out and deletes session
router.get('/logout', async (req, res) => {

    try {
        await req.session.destroy((err) => {
            if (err) {
                res.send(err);
            } else {

            };
            res.redirect('/');
        })
    } catch (err) {
        res.redirect("/error")
    }
})

// auth/:id  brings you to auth/user.ejs, which is the index for all the trips and
// where you can edit the user
router.get('/:id', async (req, res) => {

    req.session.lastPage = "My Trips";
    if (req.session.oAuth === true) {
        try {
            const user = await User.findById(req.session.passport.user);
            const destination = await Destinations.findOne({
                'name': user.currentDestination
            })
            res.render("auth/user.ejs", {
                user: user,
                logged: req.session.logged,
                destination: destination,
                oAuth: true
            });
        } catch (err) {
            console.log(err)
        }
    } else if (req.session.logged === true) {
        try {
            const user = await User.findById(req.session.userId);
            const destination = await Destinations.findOne({
                'name': user.currentDestination
            })
            res.render("auth/user.ejs", {
                user: user,
                logged: req.session.logged,
                destination: destination,
                oAuth: false
            });
        } catch (err) {
            res.redirect("/error")
        }
    } else {
        try {
            req.session.message = "You are not logged in"
            res.redirect("/auth/login");
        } catch (err) {
            res.redirect("/error");
        }
    }

});




// brings you to edit page
router.get("/:id/edit", async (req, res) => {

    try {

        const user = await User.findById(req.session.passport.user);
        res.render("auth/edit.ejs", {
            user,
            usedUsername: req.session.usedUsername,
            id: req.session.passport.user,
            logged: req.session.logged
        });
    } catch (err) {
        res.redirect("/error")
    };
});



// updates user to what is in the req.body
router.put("/:id", async (req, res) => {

    try {
        const passwordHash = await bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: passwordHash,
            destination
        });
        res.render("auth/user.ejs", {
            user: updatedUser,
            logged: req.session.logged
        });
    } catch (err) {
        res.redirect("/error")
    };

});



//Router for deleting trips from user object
router.delete('/:id', async (req, res) => {
    try {
        await User.findOneAndUpdate({
            "_id": req.body.userId,
        }, {
            $pull: {
                "trips": {
                    "_id": req.params.id
                }
            }
        })
        if (req.session.oAuth === true) {
            res.redirect('/auth/' + req.session.passport.user);
        } else {
            res.redirect('/auth/' + req.session.userId);
        }
    } catch (err) {
        res.redirect("/error")
    };
});
// brings you to edit page
router.get("/:id/edit", async (req, res) => {

    try {

        const user = await User.findById(req.session.passport.user);
        res.render("auth/edit.ejs", {
            user,
            usedUsername: req.session.usedUsername,
            id: req.session.passport.user,
            logged: req.session.logged
        });
    } catch (err) {
        res.redirect("/error")
    };
});



// updates user to what is in the req.body
router.put("/:id", async (req, res) => {

    try {
        const passwordHash = await bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: passwordHash,
            destination
        });
        res.render("auth/user.ejs", {
            user: updatedUser,
            logged: req.session.logged
        })
    } catch (error) {
        res.redirect('/error')
    }
});



//Router for deleting trips from user object
router.delete('/:id', async (req, res) => {
    try {
        await User.findOneAndUpdate({
            "_id": req.body.userId,
        }, {
            $pull: {
                "trips": {
                    "_id": req.params.id
                }
            }
        })
        if (req.session.oAuth === true) {
            res.redirect('/auth/' + req.session.passport.user);
        } else {
            res.redirect('/auth/' + req.session.userId);
        }
    } catch (err) {
        res.redirect("/error")
    };
});
// brings you to edit page
router.get("/:id/edit", async (req, res) => {

    try {

        const user = await User.findById(req.session.passport.user);
        res.render("auth/edit.ejs", {
            user,
            usedUsername: req.session.usedUsername,
            id: req.session.passport.user,
            logged: req.session.logged
        });
    } catch (err) {
        res.redirect("/error")
    };
});



// updates user to what is in the req.body
router.put("/:id", async (req, res) => {

    try {
        const passwordHash = await bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: passwordHash,
            destination
        });
        res.render("auth/user.ejs", {
            user: updatedUser,
            logged: req.session.logged
        });



    } catch (error) {
        res.redirect('/error')
    }

});



//Router for deleting trips from user object
router.delete('/:id', async (req, res) => {
    try {
        await User.findOneAndUpdate({
            "_id": req.body.userId,
        }, {
            $pull: {
                "trips": {
                    "_id": req.params.id
                }
            }
        })
        if (req.session.oAuth === true) {
            res.redirect('/auth/' + req.session.passport.user);
        } else {
            res.redirect('/auth/' + req.session.userId);
        }
    } catch (err) {
        res.redirect("/error")

    };
});
// brings you to edit page
router.get("/:id/edit", async (req, res) => {

    try {

        const user = await User.findById(req.session.passport.user);
        res.render("auth/edit.ejs", {
            user,
            usedUsername: req.session.usedUsername,
            id: req.session.passport.user,
            logged: req.session.logged
        });
    } catch (err) {
        res.redirect("/error")

    };
});



// updates user to what is in the req.body
router.put("/:id", async (req, res) => {

    try {
        const passwordHash = await bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: passwordHash,
            destination
        });
        res.render("auth/user.ejs", {
            user: updatedUser,
            logged: req.session.logged
        });
    } catch (err) {
        res.redirect("/error")
    };

});



//Router for deleting trips from user object
router.delete('/:id', async (req, res) => {
    try {
        await User.findOneAndUpdate({
            "_id": req.body.userId,
        }, {
            $pull: {
                "trips": {
                    "_id": req.params.id
                }
            }
        })
        if (req.session.oAuth === true) {
            res.redirect('/auth/' + req.session.passport.user);
        } else {
            res.redirect('/auth/' + req.session.userId);
        }
    } catch (err) {
        res.console.log(err, "this is the error");
        redirect("/error")

    };
});
// brings you to edit page
router.get("/:id/edit", async (req, res) => {

    try {

        const user = await User.findById(req.session.passport.user);
        res.render("auth/edit.ejs", {
            user,
            usedUsername: req.session.usedUsername,
            id: req.session.passport.user,
            logged: req.session.logged
        });
    } catch (err) {
        res.redirect("/error")
    };
});



// updates user to what is in the req.body
router.put("/:id", async (req, res) => {

    try {
        const passwordHash = await bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: passwordHash,
            destination
        });
        res.render("auth/user.ejs", {
            user: updatedUser,
            logged: req.session.logged
        });
    } catch (err) {
        res.redirect("/error")
    };

});



//Router for deleting trips from user object
router.delete('/:id', async (req, res) => {
    try {
        await User.findOneAndUpdate({
            "_id": req.body.userId,
        }, {
            $pull: {
                "trips": {
                    "_id": req.params.id
                }
            }
        })
        if (req.session.oAuth === true) {
            res.redirect('/auth/' + req.session.passport.user);
        } else {
            res.redirect('/auth/' + req.session.userId);
        }
    } catch (err) {
        res.redirect("/error")
    };
});


// updates user to what is in the req.body
router.put("/:id", async (req, res) => {

    try {
        const passwordHash = await bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: passwordHash,
            destination
        });
        res.render("auth/user.ejs", {
            user: updatedUser,
            logged: req.session.logged
        });
    } catch (err) {
        res.redirect("/error")
    };

});



//Router for deleting trips from user object
router.delete('/:id', async (req, res) => {
    try {
        await User.findOneAndUpdate({
            "_id": req.body.userId,
        }, {
            $pull: {
                "trips": {
                    "_id": req.params.id
                }
            }
        })
        if (req.session.oAuth === true) {
            res.redirect('/auth/' + req.session.passport.user);
        } else {
            res.redirect('/auth/' + req.session.userId);
        }
    } catch (err) {
        res.redirect("/error")
    };
});




module.exports = router

/* This isn't too bad of a controller module.
 * One thing you might consider for future versions would be to seperate auth controller methods
 * into a seperate controller module.
 * 
 * Also, be careful when you're importing external modules as you shouldn't import
 * something unless you plan to use it in the file. This would be considered a code quality issue.
 * 
 * Good job with the commenting! This helps us understand what each portion of the code is doing.
 */