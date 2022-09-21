require("dotenv").config();
const express = require("express");
const MongoClient=require("mongodb").MongoClient;
const bodyParser=require('body-parser');
const cors=require('cors');
const db=require("./db/index.js")
const mongoose=require('mongoose');
const Product=require('./models/ProductModel')
const UserInfo=require("./models/ProductModel");
var md5 = require('md5');
const ProductRouter=require("./Routes/ProductRoute")
const jwt = require('jsonwebtoken');
const cookieParser=require("cookie-parser")

const path=require('path');
if(process.env.NODE_ENV==="production"){

  app.use(express.static("food-ordering-app/build"))
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,"food-ordering-app","build","index.html"))
  })
}

const app=express();

app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.static("./public"));
 app.use(express.json());
var corsOption={
  origin:"http://localhost/3000/"
}
app.use(cors(corsOption))
app.use(bodyParser.json())
app.use(cookieParser())
db.on('error',console.error.bind(console,'MongoDb has Failed To connect error :'))

const url="mongodb+srv://ismail:xZGFHZUiqDeljwaR@foodordering.psde9sy.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(url, function(err) {
       if (err) {
           console.log(err);
       } else {
           console.log("Successfully connected to mongo DB");
       }
   });




   var userShema = new mongoose.Schema({
    name:String,
    email:{type:String,unique:true} ,
    password: String
},{collection:"UserInfo",});


const User = mongoose.model("UserInfo", userShema);





app.get('/', (req,res)=>{
res.json({message:"welcome to food ordering"})
res.send({message:"welcome to food ordering"})

})


  app.use('/api/',ProductRouter)
app.get("/user",async(req,res)=>{

  User.find({}).then((resl)=>{
    res.send(resl);
    console.log("working")
   }).catch((err)=>{
    console.log(err);
 
   })

})
app.get('/api/products',async (req,res)=>{
 Product.find({}).then((resl)=>{
   res.send(resl);
   console.log("working")
  }).catch((err)=>{
   console.log(err);

  })

    
})



app.get('/products-by-categories',async (req,res)=>{
  try{
  const product=await Product.aggregate([
      {$match:{}},
      {$group:{
        _id:'$category',
        product:{$push:"$$ROOT"}
        }},
        {$project:{name:'$_id',products:1,_id:0}}
 
 
  ])
 res.status(200).send({data:product})
 
 
  }catch(err){
 
  res.status(400).send({error:err})
   }
 
 
   })

 

app.post('/register',async (req,res)=> {
try {
  
  const { name, email, password } = req.body;  

 console.log(req.body.pass)
 const userexist= await User.findOne({email});
 if(userexist){
  res.status(400);
  res.send({status:"UserAlreadyExist"});
return;
} else{await User.create({
name,
email,
password:md5(password),
})
res.status(200);
res.send({status:"Registered"})}

} catch (error) {
  console.log(error)
}

})


app.post("/login",async(req,res)=>{
try{
const {email } = req.body;  
 await User.findOne({email},async(err,user)=>{
if(!err){
  if(user){
const isCorrect= user.password===(await md5(req.body.password))
if(isCorrect){
  
  const secret= "thisismytokenokays"
const token=await jwt.sign({id:user._id},secret)
//to get all info about user except his password and user._doc to get only user info not other info with user info
await User.updateOne({email:user.email},{token:token})
const{password,...others}=user._doc

 res.cookie("access_token",token,{
  httpOnly:true
}).status(200).json(others)
}else{
  res.status(400);
  res.send({status:"wrongPassword"})
  return;
}
  }else{
    res.status(400);
    res.send({status:"userNotFound"})
    return;
  }
}
else{console.log(err)}
 }).clone();



}catch(err){

  console.log(err)
}



})

app.get("/logout",async(req, res)=>{
res.clearCookie("access_token",{path:'/'})
res.status(200).send("userLoggedOut")


})



app.listen(process.env.PORT||4000, function() {
    console.log("Server started on port 4000");
  });
