const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.md_url;

const Connect = ()=>{
    try {
        mongoose.connect(uri, ()=>{
            console.log("Connection Successfull")
        });
    } catch (error) {
        if(error){
            console.log("Internal Server Error");
        }
    }
}
module.exports = Connect;