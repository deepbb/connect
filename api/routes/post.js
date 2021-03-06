const router  = require("express").Router()

const Post = require("../models/Post")

const User = require("../models/User")


//create a post

router.post("/",async (req,res)=>{
    const newPost =  new Post (req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)

    } catch (err) {
        res.status(400).json(err)

    }
})

router.get("/",async(req,res)=> {
    try{
        const allPosts = await Post.find()
        res.status(200).json(allPosts)
    } catch(err) {
        res.status(400).json(err)
    }
})

router.put("/:id",async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
           await post.updateOne({$set:req.body})
            res.status(200).json("update successful")

        } else {
            res.status(403).json("you can only update your posts")

        }
        

    } catch (err) {
        res.status(500).json(err)

    }
})


router.delete("/:id",async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
           await post.deleteOne()
            res.status(200).json("deleted successful")

        } else {
            res.status(403).json("you can only delete your posts")

        }
        

    } catch (err) {
        res.status(500).json(err)

    }
})


router.put("/:id/likes",async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)) {
          await  post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json("you liked the post")
        } else {
           await post.updateOne({$pull:{likes:req.body.userId}})
            res.status(200).json("you disliked the post")
        }
    }  catch (err) {
        res.status(500).json(err)

    }
})

router.get("/:id",async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get("/timeline/:userId", async (req,res)=> {
    try {
        const currentUser = await User.findById(req.params.userId)
        const userPost = await Post.find({userId:currentUser._id});
        const friendPost = await Promise.all(
            currentUser.following.map((friendId)=> {
                return Post.find({userId:friendId})
            })
        )
        res.status(200).json(userPost.concat(...friendPost))
     } catch (err) {
         res.status(500).json(err)

     }
})
//get all users posts

router.get("/posts/" , async(req,res)=> {
    try {
        const posts = await Post.find()
        res.status(200).json(posts)
    } catch(err) {
        res.status(500).json(err)
    }
    
})

router.get("/profile/:username", async (req,res)=> {
    try {
        const user = await User.findOne({username:req.params.username})
        const post = await Post.find({userId:user._id})
        res.status(200).json(post)

    } catch (err) {
        res.status(500).json(err)

    }
})


module.exports = router