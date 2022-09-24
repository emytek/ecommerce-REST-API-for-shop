const router = require("express").Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require("../models/User")
// const CryptoJS = require("crypto-js")

// REGISTER
router.post("/register", async(req, res) => {
    const { username, email, password } = req.body
  
    // Validation
    if (!username || !email || !password) {
      res.status(400).json("Please include all fields")
      // throw new Error('')
    }
  
    // Find if user already exists
    const userExists = await User.findOne({ email })
  
    if (userExists) {
      res.status(400).json("User already exist!")
      // throw new Error('User already exists')
    }
  
    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
  
    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    })
  
    if (user) { 
      res.status(201).json({
        _id: user._id,
        username: user.name,
        email: user.email,
        password: hashedPassword,
        token: generateToken(user._id)
      })
    } else {
      res.status(400)
      // throw new error('Invalid user data')
    }
})

//@desc Login a user
//@route /api/users/login
//@access Public
router.post("/login", async(req, res)  => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  // Check user and passwords match
if (user && (await bcrypt.compare(password, user.password))) {
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id)
  })
} else {
  res.status(401).json("Wrong Credentials!")
  // throw new Error('Invalid credentials')
}
})

// Generate token
const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

// const accessToken = jwt.sign(
//   {
//   id: userExists._id,
//   isAdmin: userExists.isAdmin
// }, 
//   process.env.JWT_SECRET,
// )












// //REGISTER
// router.post("/register", async (req, res) => {
//     const { username, email, password } = req.body
    
//      // Validation
//      if (!username || !email || !password) {
//         res.status(400)
//         // throw new Error('Please include all fields')
//     }

//     // Find if user already exists
//        const userExists = await User.findOne({ email })
  
//        if (userExists) {
//          res.status(400)
//         //  throw new Error('User already exists')
//        }

//        // Hash password
//         const salt = await bcrypt.genSalt(10)
//         const hashedPassword = await bcrypt.hash(password, salt)

//         // Create user
//         const user = await User.create({
//             username,
//             email,
//             password: hashedPassword,
//         })

//         if (user) {
//             res.status(201).json({
//               _id: user._id,
//               username: user.username,
//               email: user.email,
//               token: generateToken(user._id)
//             })
//           } else {
//             res.status(400)
//             // throw new error('Invalid user data')
//           }
//     // const newUser = new User({
//     //     username: req.body.username,
//     //     email: req.body.email,
//     //     password: CryptoJS.AES.encrypt("req.body.password", process.env.PASS_SEC).toString(),
//     // });

//     // try{
//     //    const savedUser = await newUser.save()
//     //    res.status(201).json(savedUser)
//     // } catch(err) {
//     //     res.status(500).json(err)
//     // }
//     // we use the async funtion to save it in the database
// })

// //LOGIN
// router.post("/login", async (req, res) => {
//     const { email, password } = req.body

//     const user = await User.findOne({ email })

//      // Check user and passwords match
//   if (user && (await bcrypt.compare(password, user.password))) {
//     res.status(200).json({
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//     //   token: generateToken(user._id)
//     })
//   } else {
//     res.status(401)
//     // throw new Error('Invalid credentials')
//   }
//     // try{
//     //     const user = await User.findOne(
//     //         {
//     //             userName: req.body.username
//     //         }
//     //     );

//     //     !user && res.status(401).json("Wrong User Name");

//     //     const hashedPassword = CryptoJS.AES.decrypt(
//     //         user.password,
//     //         process.env.PASS_SEC
//     //     );

//     //     const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

//     //     const inputPassword = req.body.password;
        
//     //     originalPassword != inputPassword && 
//     //         res.status(401).json("Wrong Password");

//     // } catch(err) {
//     //     res.status(500).json(err)
//     // }
// })

//  //the req.body.username is the condition for the findOne method


// // Generate token
// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//       expiresIn: '30d',
//     })
// }

module.exports = router