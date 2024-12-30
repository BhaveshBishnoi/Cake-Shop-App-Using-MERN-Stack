const mongoose = require("mongoose");

const connect = async () =>{
    try {
        await mongoose.connect(`${process.env.URI}`);
        console.log("Database Connected Succesfully");
        
    } catch (error) {
        console.log(error);
        
    }
}
connect();