const router = require("express").Router();
const user = require("../models/user");
const cake = require("../models/cake");
const { authenticateToken } = require("./userAuth");

router.put("/add-cake-to-favourite", authenticateToken, async (req, res) => {
  try {
    const { id, cakeid } = req.headers;
    const userData = await user.findById(id);
    const isCakeFavourite = userData.favourites.includes(cakeid);
    if (isCakeFavourite) {
      return res.status(200).json({ message: "Cake already in Favourites" });
    } else {
      await user.findByIdAndUpdate(id, { $push: { favourites: cakeid } });
      return res.status(200).json({ message: "Cake Added to Favourites" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put(
  "/remove-cake-from-favourite",
  authenticateToken,
  async (req, res) => {
    try {
      const { id, cakeid } = req.headers;
      const userData = await user.findById(id);
      const isCakeFavourite = userData.favourites.includes(cakeid);
      if (isCakeFavourite) {
        await user.findByIdAndUpdate(id, { $pull: { favourites: cakeid } });
      }
      return res.status(200).json({ message: "Cake Removed from Favourites" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

//Add book to favourites

router.get("/get-favourite-cakes", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const userData = await user.findById(id).populate("favourites");
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const favouriteCake = userData.favourites;
    return res.status(200).json({ message: "Success", data: favouriteCake });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
});

module.exports = router;
