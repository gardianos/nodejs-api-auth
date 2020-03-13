const router = require('express').Router();
const verify = require('./verifyToken');

//Private route
router.get('/', verify, (req, res) => {

    res.json({

        posts: {
            title:'my first post',
            description: 'Random data you shouldnt access'
        }
    });

    //Information user 
   // res.send(req.user);

   //Find user 
  // User.findbyOne({_id: req.user});


});


module.exports = router;