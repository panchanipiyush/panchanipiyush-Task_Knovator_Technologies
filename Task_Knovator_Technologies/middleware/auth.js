const jwt = require("jsonwebtoken")
const User = require("../model/user")
const auth = async (req, res, next) => {

    const token = req.header("auth-token")

    try {
        const data = await jwt.verify(token, process.env.SECRETKEY)
        if (data) {
            const userdata = await User.findOne({ _id: data._id })
            req.user = userdata
            req.token = token
            next();
        }
        else {
            res.send("Invalid token")
        }
    } catch (error) {
        res.send("Auth Error:- " + error)
    }
}


module.exports = auth;