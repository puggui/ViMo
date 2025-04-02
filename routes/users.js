const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");

const ExpressError = require("../utils/ExpressError")
const { storeReturnTo } = require("../middleware")

const router = express.Router();

const connection = mysql.createConnection({
  host : process.env.DB_HOST,
  user : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE
});

connection.connect(function(err){
  if(err) throw err;
  console.log(`Connected DB: ${process.env.DB_DATABASE}`);
});

router.get("/signin", (req, res) => {
  res.render("signin.ejs")
})

router.post("/signin", storeReturnTo, passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true,
  })
  ,
  (req, res) => {
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
    connection.query("SELECT USER_EMAIL FROM User WHERE USER_EMAIL = ?", [email], function (error, results) {
      if (error) throw error;
      if (results.length > 0) {
        req.flash("error", "Email is already registered");
        return res.redirect("/register");
      }
    });

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
    req.login(newUser, (err) => {
      if (err) {
        console.error("Auto login error:", err);
        req.flash("error", "Registration successful, but login failed. Please sign in.");
        return res.redirect("/signin");
      }
      req.flash("success", "Welcome! You are now signed in.");
      return res.redirect("/");
    });

  } catch (error) {
    new ExpressError("Error registering user", 500);
  }
});

router.get("/logout", (req, res) => {
  req.logout(() => {
    req.flash("success", "You have logged out");
    res.redirect("/");
  });
});

module.exports = router