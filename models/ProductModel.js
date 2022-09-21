const mongoose=require('mongoose');
const Shema=mongoose.Schema
const CategoryShema=new Shema({
  name:{type:String,required:true}

})

const ProductShema=new Shema({
    name:{type:String,required:true},
    adjective:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:String,required:true},
    category:{type:String,required:true},
    imageUrl:{type:String,required:true}

})

module.exports=mongoose.model('Product',ProductShema);