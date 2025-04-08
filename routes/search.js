const express = require("express");
const connection = require("../db");

const router = express.Router();

router.get("/search", async (req, res) => {
  const { query, option } = req.query
  let results;
  switch (option) {
    case "title":
      [results] = await connection.promise().query(`SELECT * FROM Movie WHERE MOVIE_TITLE LIKE '%${query}%'`)
      break;
    case "director":
      [results] = await connection.promise().query(`SELECT * FROM Movie WHERE MOVIE_DIRECTOR LIKE '%${query}%'`)
      break;
    case "genre":
      [results] = await connection.promise().query(`SELECT * FROM Movie WHERE MOVIE_GENRE LIKE '%${query}%'`)
      break;
    case "plot":
      [results] = await connection.promise().query(`SELECT * FROM Movie WHERE MOVIE_PLOT LIKE '%${query}%'`)
      break;
    default:
      [results] = await connection.promise().query(`SELECT * FROM Movie WHERE MOVIE_TITLE LIKE '%${query}%'`)
  }
  res.render("search.ejs", { query, option, results })
})

module.exports = router;