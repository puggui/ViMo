const express = require("express");
const bodyParser = require("body-parser")
const dotenv = require("dotenv");
const mysql = require("mysql2");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

dotenv.config();

const movies = require("./routes/movies")

const ExpressError = require("./utils/ExpressError")
const port=process.env.PORT;
const app=express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", express.static("./node_modules/bootstrap/dist/"));

const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig))
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

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

app.get("/", (req, res) => {
  const sql = "SELECT * FROM Movie"
  connection.query( sql, function (error, results) {
    if (error) throw error;
    res.render("home.ejs", {results})
  });
})

app.get("/contact", (req, res) => {
  res.render("contact.ejs")
})

app.get("/aboutus", (req, res) => {
  res.render("aboutus.ejs")
})

app.get("/signin", (req, res) => {
  res.render("signin.ejs")
})

app.get("/register", (req, res) => {
  res.render("register.ejs")
})

app.post("/register", (req, res) => {
  const {email, passwordInput, passwordConfirm} = req.body
  if (passwordInput != passwordConfirm) {
    res.send("passwords must match");
    return;
  }
  // let sql = `INSERT INTO User (USER_EMAIL, USER_PSWD_HASH, USER_PSWD_SALT) VALUES ("${email}", "hash", "salt");`
  let sql = `SELECT USER_EMAIL FROM User WHERE USER_EMAIL="${email}";`;
  console.log(sql)
  connection.query( sql, function (error, results) {
    if (error) throw error;
    if (results.length == 0) {
      
    } else {
      res.send("that email is already registered")
    }
  });

  res.send(req.body)
})

app.use('/movie', movies)

app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
})

app.use((err, req, res, next) => {
  const { statusCode = 500} = err;
  if (!err.message) err.message = 'Something Went Wrong'
  res.status(statusCode).render("notfound.ejs", {err})
})

app.listen(port,()=>{
    console.log(`Listen to ${port}`);
})