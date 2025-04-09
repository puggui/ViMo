const express = require("express");
const multer  = require('multer')
const dotenv = require("dotenv");

// middlewares
const { isAdmin } = require("../middleware")

// utils
const { generateMovieID } = require("../utils/generateMovieID");

dotenv.config();

const router = express.Router();
const connection = require("../db");
const { storage, cloudinary } = require("../cloudinary")
const upload = multer({ storage })

router.get("/add", isAdmin, (req, res) => {
  res.render("addmovie.ejs");
})

// add movie POST
// add price field
router.post("/add", isAdmin, upload.single("poster"), async (req, res) => {
  try {
    const {path, filename} = req.file;
    const {title, director, genre, year, available, plot, price} = req.body
    const id = await generateMovieID(connection);
    const sql = "INSERT INTO Movie (MOVIE_ID, MOVIE_TITLE, MOVIE_DIRECTOR, MOVIE_GENRE, MOVIE_YEAR, MOVIE_AVAILABLE, MOVIE_POSTER, MOVIE_PLOT, MOVIE_FILENAME, MOVIE_PRICE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
    await connection.promise().query(sql, [id, title, director, genre, year, available, path, plot, filename, price ])
    req.flash("success", "Successfully added a new movie")
    res.redirect(`/movie/${id}`)
  } catch (e) {
    throw e;
  }
})

// delete movie POST
router.post("/:id", isAdmin, async (req, res, next) => {
  try {
    console.log("Movie deleted");
    const id = req.params.id;
    const [results] = await connection.promise().query(`SELECT MOVIE_FILENAME FROM Movie WHERE MOVIE_ID = ?`,[id]);
    if (results.length === 0) {
      req.flash("error", "Movie not found");
      return res.redirect("/");
    }
    const filename = results[0].MOVIE_FILENAME;    
    if (filename) {
      console.log(`Deleting file from Cloudinary: ${filename}`);
      await cloudinary.uploader.destroy(filename);
    } else {
      console.log("No filename found in database. Skipping Cloudinary deletion.");
    }
    await connection.promise().query(`DELETE FROM Movie WHERE MOVIE_ID = ?`, [id]);
    req.flash("success", "Successfully deleted a movie");
    return res.redirect("/");
  } catch (error) {
    console.error("Error deleting movie:", error);
    return next(error);
  }
})

// display individial movie
router.get("/:id", (req, res) => {
  const sql = `SELECT * FROM Movie WHERE MOVIE_ID = "${req.params.id}"`
  connection.query( sql, function (error, results) {
    if (error) throw error;
    const [movie] = results
    if (!movie) {
      req.flash("error", "Cannot find that movie")
      res.redirect("/")
    }
    res.render("showmovie.ejs", {movie})
  });
})

// display edit page for movie
router.get("/:id/edit", isAdmin, (req, res) => {
  // ** need to prepopulate the poster field **
  const sql = `SELECT * FROM Movie WHERE MOVIE_ID = "${req.params.id}"`
  connection.query( sql, function (error, results) {
    if (error) throw error;
    const movie = results[0]
    res.render("editmovie.ejs", {movie})
  });
})

// edit movie POST
router.post("/:id/edit", isAdmin, upload.single("poster"), (req, res) => {
  const id = req.params.id
  const {title, director, genre, year, available, plot, price} = req.body
  const {path, filename} = req.file;
  
  // delete existing movie poster
  const select_sql = `SELECT MOVIE_FILENAME FROM Movie WHERE MOVIE_ID = "${id}"`
  connection.query( select_sql, function (error, results) {
    if (error) throw error;
    const filename = results[0].MOVIE_FILENAME
    cloudinary.uploader.destroy(filename)
    console.log("deleted old image")
  });

  // update movie
  const sql = "UPDATE Movie SET MOVIE_TITLE = ?, MOVIE_DIRECTOR = ?, MOVIE_GENRE = ?, MOVIE_YEAR = ?, MOVIE_AVAILABLE = ?, MOVIE_POSTER = ?, MOVIE_PLOT = ?, MOVIE_FILENAME = ?, MOVIE_PRICE = ? WHERE MOVIE_ID = ?;"
  connection.query( sql, [title, director, genre, year, available, path, plot, filename, price, id], function (error, results) {
    if (error) throw error;
    req.flash("success", "Successfully updated movie")
    res.redirect(`/movie/${id}`)
  });
})

module.exports = router