require("dotenv").config();
const mongoose=require('mongoose');



const url="mongodb+srv://ismail:xZGFHZUiqDeljwaR@foodordering.psde9sy.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(url, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Successfully connected to mongo DB");
    }
});
const db=mongoose.connection
module.exports=db;