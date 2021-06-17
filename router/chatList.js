const router = require("express").Router();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const dbName = "puppypound";
//this router is used to load the list of chats on to the page
router.get("/api/listings",(req,res)=>{
  if(req.session.loggedIn){
    const idUser=req.session.owner.ownerId+"_"+req.session.owner.name;
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
      if (error) {
        console.log(error);
        res.redirect("/failPage");
      }
      const db = client.db(dbName);
      const chatHistory= db.collection("chatHistory");
      chatHistory.find({'user1.id':idUser,'user1.name':req.session.owner.name}).toArray((err,data)=>{
        if(err){
          console.log(err);
          res.redirect("/failPage")
        }
          res.send(data);
      });
    });
  }else{
    res.redirect("/failPage");
  }
});
router.get("/api/adoptions",(req,res)=>{
  if(req.session.loggedIn){
    const idUser=req.session.owner.ownerId+"_"+req.session.owner.name;
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
      if (error) {
        console.log(error);
        res.redirect("/failPage");
      }
      const db = client.db(dbName);
      const chatHistory= db.collection("chatHistory");
      chatHistory.find({'user2.id':idUser,'user2.name':req.session.owner.name}).toArray((err,data)=>{
        if(err){
          console.log(err)
          res.redirect("/failPage");
        }
        res.send(data);
       })
    })
  }else{
    res.redirect("/failPage");
  }

})

module.exports = {
  router
};