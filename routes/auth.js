const router = require('express').Router();
const User = require('../model/User');
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidation , loginValidation} = require('../validation');


router.post('/register', async (req, res) => {

   //Let's validate the data before we create a user 
   const { error } = registerValidation(req.body);
   if(error) return res.status(400).send(error.details[0].message);

   // Check if the user is already in the db 
   const emailExist = await User.findOne({ email: req.body.email});
   if (emailExist) return res.status(400).send('Email already exist');

   //Hash the password [ generate the salt ]
   const salt = await bcrypt.genSalt(10);
   const hashPassword = await bcrypt.hash(req.body.password, salt);

   // Create a new user 
   const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password

   });
   try{
    const savedUser = await user.save();
    //SEND ALL PARAMETER'S
    //res.send(savedUser);

    //SEND user with ID 
    res.send({user: user._id});

   }catch(err){

    res.status(400).send(err);

   }


});

//LOGIN
router.post('/login', async (req, res) => {
   //Let's validate the data before we create a user 
   const { error } = loginValidation(req.body);
   if(error) return res.status(400).send(error.details[0].message);

   // Check if email exist 
   const user = await User.findOne({ email: req.body.email});
   if (!user) return res.status(400).send('Email is not found');

   //Password is correct 
   const validPass = await bcrypt.compare(req.body.password, user.password);
   if(!validPass) return res.status(400).send('Invalid Password!');

   //Create and assign token 
   const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
   res.header('auth-token', token).send(token);

   //res.send('Logged in');


});


module.exports = router;