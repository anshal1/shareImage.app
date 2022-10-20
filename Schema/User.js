const mongoose = require("mongoose");
const {Schema} = mongoose;

const NewUser = new Schema({
    username:{
        type: String,
        require: true,
        unique: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    }
})

const CreateUser = mongoose.model("Users", NewUser);
module.exports = CreateUser;