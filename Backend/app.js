const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
require("./connection/connect");
const User = require("./routes/user");
app.use(express.json());
const Cakes = require("./routes/cake");
const Favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");
app.use(cors());

//Handle Routes

app.use("/api/v1", User);
app.use("/api/v1", Cakes);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);

app.listen(process.env.PORT, () => {
  console.log(`Server is Started on port http:localhost:${process.env.PORT}`);
});
