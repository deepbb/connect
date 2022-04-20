const router = require("express").Router();
const bcrypt = require('bcrypt');
const User = require ("../models/User")
//update a user

router.put("/:id", async (req,res)=>{
    if(req.body.userId === req.params.id) {
        if(req.body.password) {
            try {
                const salt = await  bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password,salt)
            } catch (err) {
                return res.status(400).json("you are not allowed to update")
            }
        }
        try {
            const user = await  User.findByIdAndUpdate(req.params.id,{$set:req.body,})
            res.status(200).json(user)
        } catch (err) {
            res.status(400).json(err)

        }
    }
})

router.delete("/:id", async (req,res)=>{
    if(req.body.userId === req.params.id) {
        try {
             await User.findByIdAndDelete(req.params.id)
           return res.status(200).json("your account has been deleted")
        } catch (err) {
          return  res.status(500).json(err)

        }
    } else  {
        res.status(400).json("you are not allowed to delete")

    }
})
//get a user
router.get("/", async (req,res)=>{
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId ? await User.findById(userId)
        : await User.findOne( { username:username })
        res.status(200).json(user)

    } catch(err) {
        res.status(400).json("user not found")
    }
})

router.get("/friend/:userId", async (req,res)=> {
    try{
        const user = await User.findById(req.params.userId)
        console.log(user);
        const friends = await Promise.all(
            user.following.map((friendId)=> {
                return User.findById(friendId)
            })
        );
        let friendList = []
        friends.map((friend)=> {
            const {_id,username,profilePicture} = friend;
            friendList.push({_id,username,profilePicture})
        })
        res.status(200).json(friendList)

    } catch(err) {
        res.status(500).json(err)
    }
})
//follow a user
router.put("/:id/follow" ,async (req,res)=>{
    if(req.body.id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push: {followers:req.body.userId}})
                await currentUser.updateOne({$push: {following:req.body.userId}})
                res.status(200).json("user has been followed")
            } else {
                res.status(403).json("you are already following this user")
            }
            

        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("you cannot follow yourself")
    }
})

//unfollow a user



router.put("/:id/unfollow" ,async (req,res)=>{
    if(req.body.id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull: {followers:req.body.userId}})
                await currentUser.updateOne({$pull: {following:req.body.userId}})
                res.status(200).json("user has been unfollowed")
            } else {
                res.status(403).json("you dont follow this user")
            }
            

        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("you cannot  unfollow yourself")
    }
})

//get all users

router.get("/users", async(req,res)=> {
    try {
        const users = await User.find()
    res.status(200).json(users)
    } catch(err) {
        res.status(400).json(err)
    }
    
})






module.exports = router