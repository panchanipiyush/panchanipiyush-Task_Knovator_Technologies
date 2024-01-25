const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
    uName:{
        type:String,
        required:true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    pass: {
        type: String,
        required: true
    },
    Tokens: [
        {
            token: {
                type: String
            }
        }
    ]
})

UserSchema.pre("save", async function () {
    // console.log("okkk");
    try {
        if (this.isModified("pass")) {
            this.pass = await bcrypt.hash(this.pass, 10)
        }
    } catch (error) {
        console.log(error);
    }
})

UserSchema.methods.generateToken = async function(){
  
    try {
        const token  = await jwt.sign({_id:this._id},process.env.SECRETKEY)
        // console.log(token);
        this.Tokens = this.Tokens.concat({token:token})
        this.save()
        return token;
    } catch (error) {
        
    }
}

const User = new mongoose.model("task", UserSchema)
module.exports = User;