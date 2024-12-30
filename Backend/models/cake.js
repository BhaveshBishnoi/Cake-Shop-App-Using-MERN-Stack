const mongoose = require("mongoose");

const cake = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    link:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
}, {timestamps:true});

module.exports = mongoose.model("cake",cake)