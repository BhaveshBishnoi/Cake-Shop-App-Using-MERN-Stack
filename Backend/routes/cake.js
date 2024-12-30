const router = require("express").Router();
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const cake = require("../models/cake");
const { authenticateToken } = require("./userAuth");

// Add Cake --admin
router.post("/add-cake", authenticateToken, async (req, res) => {
  try {
    // Expecting admin's user ID in headers
    const { id } = req.headers;
    // Changed from User to user
    const visiter = await user.findById(id);

    if (!visiter) {
      return res.status(404).json({ status: "User not found" });
    }

    if (visiter.role !== "admin") {
      return res.status(403).json({ status: "Access Denied!" });
    }

    const { url, title, link, price, description } = req.body;
    // Destructured req.body
    const newCake = new cake({
      url,
      title,
      link,
      price,
      description,
    });

    await newCake.save();
    res.status(200).json({ message: "Cake Added Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Update Cake  --admin

router.put("/update-cake", authenticateToken, async (req, res) => {
  try {
    // Expecting admin's user ID in headers
    const { cakeid } = req.headers;
    await cake.findByIdAndUpdate(cakeid, {
      url: req.body.url,
      title: req.body.title,
      link: req.body.link,
      price: req.body.price,
      description: req.body.description,
    });

    return res.status(200).json({ message: "Cake Updated Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete Cake --admin

router.delete("/delete-cake", authenticateToken, async (req, res) => {
  try {
    const { cakeid } = req.headers;
    await cake.findByIdAndDelete(cakeid);

    return res.status(200).json({ message: "Cake Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Access Denied!!" });
  }
});

//Get All Cakes

router.get("/get-all-cakes", async (req, res) => {
  try {
    const Cakes = await cake.find().sort({ createdAt: -1 });
    return res.status(200).json({ message: "Success", Data: Cakes });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get Recent Cakes

router.get("/get-recent-cakes", async (req, res) => {
  try {
    const Cakes = await cake.find().sort({ createdAt: -1 }).limit(4);
    return res.status(200).json({ message: "Success", Data: Cakes });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get Cakes By ID

router.get("/get-cake-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const Cake = await cake.findById(id);
    return res.status(200).json({ message: "Success", Data: Cake });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
