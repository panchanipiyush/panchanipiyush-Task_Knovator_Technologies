const mongoose = require("mongoose");


const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
        
    },
    body: {
        type: String,
        required: true
    },
    createdby: {
       type:String
    },
    isActive: {
        type: Boolean,
        default: false
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
})
const PostUser = new mongoose.model("post", postSchema);
module.exports = PostUser;

