// const { verifyToken, verifyTokenAndAuthorization } = require("./verifyToken");
// const bcrypt = require('bcryptjs')
const router = require("express").Router();
const { protect, verifyTokenAndAdmin } = require('../middleware/authMiddleware')
const asyncHandler = require('express-async-handler')
const User = require('../models/User')

//GET USER --test
router.get('/me', protect, asyncHandler(async(req, res) => {
    const user = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.username
    }
    res.status(200).json(user)
}))

//UPDATE
router.put('/:id', protect, asyncHandler(async(req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedUser);
      } catch (err) {
        res.status(500).json(err);
    }
}))

//DELETE
router.delete('/:id', protect, asyncHandler(async(req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
      } catch (err) {
        res.status(500).json(err);
    }
}))

// GET USER 
router.get('/find/:id', verifyTokenAndAdmin, asyncHandler(async(req, res) => {
    res.status(200).json(req.user)
}))

// GET USERS 
// router.get('/find/', verifyTokenAndAdmin, asyncHandler(async(req, res) => {
//     try{
//         const users = await User.find()
//         res.status(200).json(users)
//     } catch(err){
//         res.status(500).json(err)
//     }
// }))

//GET THE LATEST FIVE USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(5)
        : await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
});

//GET USER STATS
// ...It returns us total number of users for each month 
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();    //current date
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },  //createdAt condition : greater than last year
        {
          $project: {
            month: { $month: "$createdAt" },    //takes the month from the createdAt attribute and assign it to the month var
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },     //total user number to sum every registered user
          },
        },   //so this outputs this data structure => { id: month, total: no of registered users for that month}
      ]);
      res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err);
    }
});

// router.put("/:id", verifyTokenAndAuthorization, async(req, res) => {
//    if(req.body.password){
//     req.body.password= bcrypt.hash(password, salt)
//    }
   
//    try {
//      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
//         $set: req.body
//      }, {new: true}
//      );
//      res.status(200).json(updatedUser) 
//    } catch(err) {
//       res.status(500).json(err)
//    }
// })
module.exports = router