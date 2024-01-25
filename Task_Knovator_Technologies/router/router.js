const router = require("express").Router();
const User = require("../model/user");
const PostUser = require("../model/postdata");
const bcrypt = require("bcryptjs")
const auth = require("../middleware/auth")

const passport = require("passport");
require('../middleware/passport')(passport);

/********************* user registration api router. Task-1/2 *********************/ 
// http://localhost:9000/registration       

router.post("/registration", async (req, res) => {
    try {
        const RegData = new User(req.body)
        const saveData = await RegData.save()
        res.send(saveData)
    } catch (error) {
        res.send("error : "+ error)
    }
})

/********************* find registred user api router. *********************/ 
//  http://localhost:9000/getuser    


router.get("/getuser", async (req, res) => {

    try {
        const userData = await User.find()
        res.send(userData)
    } catch (error) {
        res.send("error : "+ error)
    }
})

/********************* user login and generate JWt token api router. *********************/ 
// http://localhost:9000/login

router.post("/login", async (req, res) => {
    try {
        const userData = await User.findOne({ email: req.body.email })
        const isValid = await bcrypt.compare(req.body.pass, userData.pass)
       
        if (isValid) {
            const token = await userData.generateToken();
            res.send("Token  : " + token)
        }
        else {
            res.send("Invalid credentials !!!!")
        }
    } catch (error) {
        console.log(error);
        res.send("Invalid credentials : "+ error);
    }
})

/********************* only Authenticated user can post router. *********************/ 
// http://localhost:9000/postData


router.post("/postData",passport.authenticate('jwt',{session:false}),async (req, res) => {
    try {
        const user =   req.user
        const postData = new PostUser({
            title : req.body.title,
            body : req.body.body,
            createdby : user.uName,
            isActive : req.body.isActive,
            latitude : req.body.latitude,
            longitude : req.body.longitude
        })
        const data = await postData.save()
        res.send(data)
    } catch (error) {
       res.send("invalid credentials :" + error)
    }
})

/********************* fetch data by latitude longitude api router. *********************/ 
//  http://localhost:9000/LatLong

router.post("/LatLong", async (req, res) => {
        // const data = await PostUser.find()        
    try {
        const postdata = await PostUser.find({latitude:req.body.latitude,longitude:req.body.longitude})
        console.log("ok");
        res.send(postdata)
    } catch (error) {
        res.send("Error : " + error)
    }
})

/********************* fetch status how many post active and inActive api router. *********************/ 
//  http://localhost:9000/PostStatusCount


router.get("/PostStatusCount",async(req,res)=>{
    try {
        const getdata = await PostUser.find()
        var count = 0;
            for (let i = 0; i < getdata.length; i++) {
                if(getdata[i].isActive == true){
                    count++;
                }
            }
            var lengthOfgetData = getdata.length
            const inactive = Number(lengthOfgetData) - (count)
           
        res.send(`active status = ${count}, inActive Status = ${inactive}`)

    } catch (error) {
        console.log(error);
        res.send("Error : "+  error)
    }
})

/********************* logout in current device router api router. *********************/ 

router.get("/logout", auth, async (req, res) => {

    try {
      const user = req.user;
      const tokenToRemove = req.token

      user.Tokens = await user.Tokens.filter(ele => ele.token != tokenToRemove);

      const dt = await user.save();
    
      res.send("Logout successful");
    } catch (error) {
      console.error(error);
      res.send( "Internal Server Error :"  + error);
    }
  });

router.get("/logoutAll", auth, async (req, res) => {
    try {
      const user = req.user;    
      // Remove the token from the user's Tokens array
      user.Tokens = []
      // Save the user with the updated Tokens array
      const dt = await user.save();
        console.log(dt);
        res.send("Logout all Device successful");
    } catch (error) {
      res.send( "Internal Server Error :" + error);
    }
  });

module.exports = router