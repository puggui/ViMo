const express = require("express");
const bodyParser = require("body-parser")
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport")
const LocalStrategy = require("passport-local")
const bcrypt = require("bcryptjs")
const cookieSession = require('cookie-session');

dotenv.config();

const connection = require("./db")
const movieRoutes = require("./routes/movies")
const userRoutes = require("./routes/users")
const cartRoutes = require("./routes/carts")
const ExpressError = require("./utils/ExpressError")
const port=process.env.PORT;
const app=express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", express.static("./node_modules/bootstrap/dist/"));

const cookieSecret = process.env.COOKIE_SECRET || "cookie monster"
app.use(cookieSession({
  name: 'userPreferences', // Separate name to avoid conflict with express-session
  secret: cookieSecret,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: false, // Set to true if using HTTPS
  httpOnly: true,
  sameSite: 'strict'
}));

const secret = process.env.SECRET || "thisshouldbeabettersecret"
const sessionConfig = {
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: false
  }
}

app.use(session(sessionConfig))
app.use(flash());

passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const [rows] = await connection.promise().query("SELECT * FROM User WHERE USER_EMAIL = ?", [email]);
      if (rows.length === 0) {
        return done(null, false, { message: "Incorrect email or password." });
      }

      const [user] = rows;
      const isMatch = await bcrypt.compare(password, user.USER_PSWD_HASH);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect email or password." });
      }

      return done(null, user);

    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.USER_EMAIL);
});

passport.deserializeUser(async (email, done) => {
  try {
    const [rows] = await connection.promise().query("SELECT * FROM User WHERE USER_EMAIL = ?", [email]);
    if (rows.length === 0) return done(null, false);
    return done(null, rows[0]);
  } catch (err) {
    return done(err);
  }
});

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  next();
});

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

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

app.use("/", userRoutes);
app.use("/", cartRoutes);
app.use("/movie", movieRoutes);

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