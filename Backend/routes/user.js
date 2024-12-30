const router = require("express").Router();
const user = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const {authenticateToken} = require("./userAuth")

//Sign-Up Functionality

router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    //Username length is 4
    if (username.length < 4) {
      return res
        .status(400)
        .json({ message: "Username length should be greater than 4" });
    }

    //Check Username Already in DB or Not
    const ExistingUsername = await user.findOne({ username: username });
    if (ExistingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    //Check Email Already in DB or Not
    const ExistingEmail = await user.findOne({ email: email });
    if (ExistingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //Password length is 6
    if (password.length <= 5) {
      return res.status(400).json({
        message: "Password length should be greater than 5",
      });
    }
    const hashPass = await bcrypt.hash(password,10)

    //Creating New User
    const newUser = new user({
      username: username,
      email: email,
      password: hashPass,
      address: address,
    });

    await newUser.save();
    res.status(200).json({ message: "Account created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Login Functionality

router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await user.findOne({ username });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // compare password with the stored hash
    const isMatch = await bcrypt.compare(password, existingUser.password); 
    
    if (isMatch) {
      const authClaims =[{name:existingUser.name},{role:existingUser.role}]
      const token = jwt.sign({authClaims},"cakeshop001",{expiresIn:"30d"})
      return res.status(200).json({ id:existingUser._id, role:existingUser.role, token:token });
    } else {
      return res.status(400).json({ message: "Invalid Credentials" });
    }


  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//get user info

router.get("/get-user-information",authenticateToken, async (req,res)=>{
  try {
    const {id} = req.headers;
    const data = await user.findById(id).select('-password');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
})

//update Address

router.put("/update-address",async (req,res)=>{
  try {
    const {id} = req.headers;
    const {address} = req.body;
    await user.findByIdAndUpdate(id,{address:address})
    return res.status(200).json({message:"Address Updated Successfully"});

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
})

module.exports = router;


