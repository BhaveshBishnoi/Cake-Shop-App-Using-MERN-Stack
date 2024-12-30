const mongoose = require("mongoose");
const user = require("./user");

const order = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"user",
    },
    cake:{
        type:mongoose.Types.ObjectId,
        ref:"cake",
    },
    status:{
        type:String,
        default:"Order Placed",
        enum:["Order Placed", "Preparing Cake", "Deliverd Succesfully"]
    },

}, {timestamps:true});

module.exports = mongoose.model("order",order)