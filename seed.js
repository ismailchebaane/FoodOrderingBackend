require("dotenv").config();
const {faker}=require("@faker-js/faker");
const MongoClient=require("mongodb").MongoClient;
const _=require('lodash');
async function main (){

const url="mongodb+srv://ismail:xZGFHZUiqDeljwaR@foodordering.psde9sy.mongodb.net/?retryWrites=true&w=majority";
const client=new MongoClient(url)

try{
 await client.connect();
 const productCollection=client.db("test").collection("products")
  const categoryCollection=client.db("test").collection("categories")
  productCollection.drop()
  let categories=['breakfast','lunch','dinner','drinks'].map((category)=>{
return{name:category}})
   
await categoryCollection.insertMany(categories)
let imageUrl=['https://res.cloudinary.com/dlv0lekro/image/upload/v1657056151/food-ordering-app/1_mfgcb5.png',
               'https://res.cloudinary.com/dlv0lekro/image/upload/v1657056151/food-ordering-app/2_afbbos.png',
               'https://res.cloudinary.com/dlv0lekro/image/upload/v1657056151/food-ordering-app/3_iawvqb.png']


let products=[]
for(let i=0;i<10;i+=1){
    let newProduct={
    name:faker.commerce.productName(),
    adjective:faker.commerce.productAdjective(),
    description:faker.commerce.productDescription(),
    price:faker.commerce.price()+"DT",
    category:_.sample(categories),
    imageUrl:_.sample(imageUrl)


    };
    products.push(newProduct)
}
await productCollection.insertMany(products)

}catch(err){

console.error(err);
}finally{
    await client.close()
}


}

main();