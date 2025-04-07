const express = require("express");
const { generateCartID } = require("../utils/generateCartID");
const connection = require("../db");
const router = express.Router();

// display cart page
router.get("/cart", async (req, res) => {
  if (req.session.cartID) {
    const sql = "SELECT ci.item_id, m.MOVIE_TITLE AS name, m.MOVIE_POSTER AS poster, m.MOVIE_DIRECTOR AS director, m.MOVIE_PRICE AS price , ci.quantity, (m.MOVIE_PRICE * ci.quantity) AS total_price FROM CartItems ci JOIN Movie m ON ci.item_id = m.MOVIE_ID WHERE ci.cart_id = ?;"
    const [items] = await connection.promise().query(sql, [req.session.cartID])
    let subtotal = 0;
    items.forEach(item => {
      subtotal += parseFloat(item.total_price);
    });
    return res.render("cart.ejs", { items, subtotal })
  }
  res.render("cart.ejs", { items: [] })
})

// POST route to add item to cart
router.post("/cart/add", async (req, res) => {
  try {
    const { productID } = req.body
    // create new cart or find existing cart
    if (!req.session.cartID) {
      const id = await generateCartID(connection);
      await connection.promise().query("INSERT INTO Cart (cart_id) VALUES (?);", [id]);
      req.session.cartID = id;
    }

    const { cartID } = req.session;
    // increment quantity for existing product or add new product
    const [cart] = await connection.promise().query("SELECT * FROM CartItems WHERE cart_id = ? AND item_id = ?;", [cartID, productID])

    if (!cart.length) {
      await connection.promise().query("INSERT INTO CartItems (cart_id, item_id, quantity) VALUES (?, ?, 1);", [cartID, productID])
    } else {
      const qty = cart[0].quantity + 1
      await connection.promise().query("UPDATE CartItems SET quantity = ? WHERE cart_id = ? AND item_id = ?;", [qty, cartID, productID])
    }

    req.flash("success", "Added item to cart");
    res.redirect(`/movie/${productID}`)
  } catch (err) {
    console.error("Cart insert error:", err);
    req.flash("error", "Could not add item to cart");
    res.redirect("back");
  }
})

// POST route to delete item to cart
router.post("/cart/delete/:id", async (req, res) => {
  const { id } = req.params;
  const { cartID } = req.session;
  await connection.promise().query("DELETE FROM CartItems WHERE cart_id = ? AND item_id = ?;", [cartID, id]);
  req.flash("success", "Successfully deleted item");
  res.redirect("/cart")
})

module.exports = router;