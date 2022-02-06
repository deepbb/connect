const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/signup", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json("wrong password")

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;



// const router = require("express").Router();
// const bcrypt = require('bcrypt');

// const User = require ("../models/User")

// router.post("/signup", async (req,res)=>{
//     try {
//         const salt = await bcrypt.genSalt(10)
//         const hashedpassword = await bcrypt.hash(req.body.password,salt)

//         const user =  await new User ({
//             username:req.body.username,
//             email:req.body.email,
//             password:hashedpassword
//         })
//         const newUser = await user.save()
//         res.status(200).json(newUser)
//         res.send("ok")

//     } catch (err) {
//           res.status(404).json("Enter all credentials")
//         }
// })


// router.get("/login",async (req,res)=>{
//     try {
//     const user = await User.findOne({email:req.body.email})
//     !user &&  res.status(404).json("user not found")
//         const validatePassword = await bcrypt.compare(req.body.password, user.password)
    
//     !validatePassword && res.status(400).json("password not valid")

//         res.status(200).json(user)

// } catch (err) {
//     res.status(404).json("error")

// }
// })


// module.exports = router