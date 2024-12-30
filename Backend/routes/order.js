const router = require("express").Router();
const Order = require("../models/order");
const cake = require("../models/cake");
const user = require("../models/user");
const { authenticateToken } = require("./userAuth");

//place order logic

router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const order = req.body;
    for (const orderData of order) {
      const newOrder = new Order({ user: id, cake: orderData._id });
      const orderDataFromDb = await newOrder.save();

      //Saving Order in Model

      await user.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id },
      });

      //Clearing Cart

      await user.findByIdAndUpdate(id, {
        $pull: { cart: orderDataFromDb._id },
      });

      return res.json({ message: "Order Placed Successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "An Error Occured!" });
  }
});

//Get Order History User

router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await user.findById(id).populate({
      path: "orders",
      populate: { path: "cake" },
    });
    const orderData = userData.orders.reverse();
    res.status(200).json({
      status: "Success",
      Data: orderData,
    });
  } catch (error) {
    res.status(500).json({ message: "An Error Occured!" });
  }
});

//get-all-orders --admin

router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const userData = await Order.find()
      .populate({
        path: "book",
      })
      .populate({
        path: "user",
      })
      .sort({ createdAt: -1 });
    return res.json({
      status: "Success",
      data: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

//Update order Status --admin

router.put("/update-status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id, { status: req.body.status });
    return res.json({
      status: "Success",
      message: "Status Updated Successfully",
    });
  } catch (error) {}
});

module.exports = router;