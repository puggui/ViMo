const express = require("express");
const connection = require("../db");
const { deserializeUser } = require("passport");

const router = express.Router();

router.get("/", async (req, res) => {
  const { query, title, director, plot, genre } = req.query;
  console.log(req.query);

  let sql = "SELECT * FROM Movie";
  const conditions = [];
  const values = [];

  if (query) {
    if (title) {
      conditions.push("MOVIE_TITLE LIKE ?");
      values.push(`%${query}%`);
    }
    if (director) {
      conditions.push("MOVIE_DIRECTOR LIKE ?");
      values.push(`%${query}%`);
    }
    if (plot) {
      conditions.push("MOVIE_PLOT LIKE ?");
      values.push(`%${query}%`);
    }
    if (genre) {
      conditions.push("MOVIE_GENRE LIKE ?");
      values.push(`%${query}%`);
    }

    // Fallback: if no fields selected, search all
    if (conditions.length === 0) {
      conditions.push(
        "MOVIE_TITLE LIKE ?",
        "MOVIE_PLOT LIKE ?",
        "MOVIE_DIRECTOR LIKE ?",
        "MOVIE_GENRE LIKE ?"
      );
      values.push(`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`);
    }

    sql += " WHERE " + conditions.join(" OR ");
  }

  try {
    const [results] = await connection.promise().query(sql, values);
    res.render("search.ejs", { query, title, director, plot, genre, results });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error executing search query.");
  }
});

module.exports = router;