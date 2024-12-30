const router = require("express").Router();
const user = require("../models/user");
const cake = require("../models/cake");
const { authenticateToken } = require("./userAuth");

router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { id, cakeid } = req.headers;
    const userData = await user.findById(id);
    const isCakeInCart = userData.cart.includes(cakeid);
    if (isCakeInCart) {
      return res.status(200).json({ Status:"Success",message: "Cake already in Favourites" });
    } else {
      await user.findByIdAndUpdate(id, { $push: { cart: cakeid } });
      return res.status(200).json({ message: "Cake Added to Cart" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put(
  "/remove-cake-from-cart/:cakeid",
  authenticateToken,
  async (req, res) => {
    try {
      const { id, cakeid } = req.headers;
      const userData = await user.findById(id);
      const isCakeInCart = userData.cart.includes(cakeid);
      if (isCakeInCart) {
        await user.findByIdAndUpdate(id, { $pull: { cart: cakeid } });
      }
      return res.status(200).json({ message: "Cake Removed from Cart" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

//Add book to favourites

router.get("/get-Cart-products", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const userData = await user.findById(id).populate("cart");
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const favouriteCake = userData.cart;
    return res.status(200).json({ message: "Success", data: favouriteCake });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
});

module.exports = router;
