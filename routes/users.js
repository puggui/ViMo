// Testing signing in to an admin account
// method: POST
// URL: http://localhost:3030/signin
// body: x-www-form-urlencoded
//    email       admin@gmail.com
//    password    admin

const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");

const ExpressError = require("../utils/ExpressError");
const { storeReturnTo } = require("../middleware");
const { generateCartID } = require("../utils/generateCartID");
const { assignCartToUser } = require("../utils/cartHelper")
const connection = require("../db");

const router = express.Router();

router.get("/signin", (req, res) => {
  res.render("signin.ejs")
})

router.post("/signin", storeReturnTo, passport.authenticate("local", {
  failureRedirect: "/signin",
  failureFlash: true,
})
  ,
  async (req, res) => {
    await assignCartToUser(req);

    req.flash("success", "Signed in successfully")
    const redirectUrl = res.locals.returnTo || '/';
    res.redirect(redirectUrl)
  }
);

router.get("/register", (req, res) => {
  res.render("register.ejs")
})

router.post("/register", async (req, res) => {
  const { name, email, passwordInput, passwordConfirm } = req.body;
  if (passwordInput !== passwordConfirm) {
    req.flash("error", "Passwords must match");
    return res.redirect("/register");
  }
  try {
    // check for existing email
    const [existingUser] = await connection.promise().query(
      "SELECT USER_EMAIL FROM User WHERE USER_EMAIL = ?",
      [email]
    );
    if (existingUser.length > 0) {
      req.flash("error", "Email is already registered");
      return res.redirect("/register");
    }

    // register user
    const hashedPassword = await bcrypt.hash(passwordInput, 10);
    await connection.promise().query("INSERT INTO User (USER_NAME, USER_EMAIL, USER_PSWD_HASH) VALUES (?, ?, ?)", [name, email, hashedPassword]);
    console.log("Registration successful")

    // get new user
    const [newUserRows] = await connection.promise().query(
      "SELECT * FROM User WHERE USER_EMAIL = ?",
      [email]
    );
    const [newUser] = newUserRows;

    // sign in the user
    req.login(newUser, async (err) => {
      if (err) {
        console.error("Auto login error:", err);
        req.flash("error", "Registration successful, but login failed. Please sign in.");
        return res.redirect("/signin");
      }
      await assignCartToUser(req);
      
      req.flash("success", "Welcome! You are now signed in.");
      return res.redirect("/");
    });

  } catch (error) {
    throw new ExpressError("Error registering user", 500);
  }
});

router.get("/logout", (req, res) => {
  req.logout(); // no callback
  req.flash("success", "You have logged out");
  req.session = null;
  res.redirect("/");
});


module.exports = router