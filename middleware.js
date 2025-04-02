module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
      res.locals.returnTo = req.session.returnTo;
  }
  next();
}

module.exports.isSignedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in")
    res.redirect("/signin")
  }
  next();
}

module.exports.isAdmin = (req, res, next) => {
  if (!req.isAuthenticated() || !req.user.USER_ISADMIN) {
    req.flash("error", "You must an admin")
    res.redirect("/")
  }
  next();
}