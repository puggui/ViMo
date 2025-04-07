const { generateCartID } = require("./generateCartID");
const connection = require("../db");

module.exports.assignCartToUser = async (req) => {
  try {
    const userEmail = req.user.USER_EMAIL;

    // Check if cart already exists for this user
    const [existingUserCart] = await connection.promise().query(
      "SELECT cart_id FROM Cart WHERE user_email = ? LIMIT 1;",
      [userEmail]
    );

    let cartID;

    if (existingUserCart.length !== 0) {
      cartID = existingUserCart[0].cart_id;
      req.session.cartID = cartID;
      console.log("Cart found for user:", cartID);
      return;
    }

    // No cart found for the user, so we need to generate a new cart_id
    cartID = req.session.cartID
    req.session.cartID = cartID;

    // Insert the new cart into the Cart table for the user
    await connection.promise().query(
      "INSERT INTO Cart (cart_id, user_email) VALUES (?, ?) ON DUPLICATE KEY UPDATE user_email = VALUES(user_email);",
      [cartID, userEmail]
    );

    console.log("New cart created with ID:", cartID);

  } catch (err) {
    console.error("Error assigning cart to user:", err);
    throw new Error("Error assigning cart to user");
  }
};
