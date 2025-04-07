const crypto = require("crypto");

module.exports.generateCartID = async (connection) => {
  let id;
  let isUnique = false;

  while (!isUnique) {
    id = crypto.randomBytes(4).toString("hex");
    const [rows] = await connection
      .promise()
      .query("SELECT * FROM Cart WHERE cart_id = ?", [id]);

    if (rows.length === 0) {
      isUnique = true;
    }
  }
  return id;
};