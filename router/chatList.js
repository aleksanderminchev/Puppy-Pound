const router = require("express").Router();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const dbName = "puppypound";

router.get("/api/listings",(req,res)=>{
  const idUser=req.session.owner.ownerId+"_"+req.session.owner.name;
  console.log(idUser);
  MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
      if (error) {
          console.log(error);
     }
     const db = client.db(dbName);
     const chatHistory= db.collection("chatHistory");
    chatHistory.find({'user1.id':idUser,'user1.name':req.session.owner.name}).toArray((err,data)=>{
       if(err){console.log(err)}
         res.send(data)
    });
  })
})
router.get("/api/adoptions",(req,res)=>{
  const idUser=req.session.owner.ownerId+"_"+req.session.owner.name;
  console.log(idUser);
  MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
      if (error) {
          console.log(error);
     }
     const db = client.db(dbName);
     const chatHistory= db.collection("chatHistory");
     chatHistory.find({'user2.id':idUser,'user2.name':req.session.owner.name}).toArray((err,data)=>{
      if(err){console.log(err)}
     
          res.send(data);
    
     })
    
  })
 
})

module.exports = {
  router
};