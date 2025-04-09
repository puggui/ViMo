const crypto = require("crypto");

module.exports.generateMovieID = async (connection) => {
  let id;
  let isUnique = false;

  while (!isUnique) {
    id = crypto.randomBytes(4).toString("hex");
    const [rows] = await connection
      .promise()
      .query("SELECT * FROM Movie WHERE MOVIE_ID = ?", [id]);

    if (rows.length === 0) {
      isUnique = true;
    }
  }
  return id;
};