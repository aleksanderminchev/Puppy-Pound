const express=require("express");
const app=express();
require('dotenv').config()
//for session
const session = require('express-session');
//store: new MongoStore(options)
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
//for chat portiom
const history=require("./router/chatList");
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// for images
const fs = require("fs");
const fileReader=require("multer");
const uploadDest=fileReader({
    dest:__dirname+"/public/images/temp/"
});
//loading webpages
const navbar=fs.readFileSync(__dirname+"/public/homepage/homepage.html","utf-8");
const search= fs.readFileSync(__dirname+"/public/search/search.html","utf-8");
const footer= fs.readFileSync(__dirname+"/public/footer/footer.html","utf-8");
const register=fs.readFileSync(__dirname+"/public/register/register.html","utf-8");
const adoption=fs.readFileSync(__dirname+"/public/adoption/adoption.html","utf-8");
const profile=fs.readFileSync(__dirname+"/public/profile/profile.html","utf-8");
const chat=fs.readFileSync(__dirname+"/public/chat/chat.html","utf-8");
const chatHistory=fs.readFileSync(__dirname+"/public/chatHistory/chatHistory.html","utf-8");

//connections for the database
const MongoClient = require("mongodb").MongoClient;
const password=process.env.DB_PASSWORD;
const user=process.env.DB_USER;
const url = "mongodb+srv://"+user+":"+password+"@puppyshelter.xfqtn.mongodb.net/puppypound?retryWrites=true&w=majority";
const dbName = "puppypound";


const PORT =process.env.PORT
server.listen( PORT || 8080,(err)=>{
    if(err){
        console.log(err);
    }
});

let tempChat=[];
let searchZip;
let userListerId='lobby';
let userAdopterId;
//on connect load temp chat on screen ok
//add date in chat.js ok
//add second Id ok
//after disconnect save tempchat in db ok
io.on('connect', (socket) =>{
    const room=userListerId+"_"+userAdopterId
    socket.join(room);
    
   console.log(io.sockets.adapter.rooms);
   io.of("/").adapter.on("delete-room", (rooms) => {
    if(rooms === room){
        console.log(`room ${rooms} destroyed`);
        //put temp chat push here
    }
        
  });
    socket.on('disconnect', () => {
        if(true)
            MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
                  if (error) {
                   console.log(error);
                    res.redirect("/failPage");
                    };
            
                     const db = client.db(dbName);
                    const chatHistory= db.collection("chatHistory");
                    if(tempChat.length !== 0){
                    tempChat.map((message)=>{
                        chatHistory.updateOne({'user1.id':userListerId,'user2.id':userAdopterId},{$push:{messages:message}},(data)=>{ 
                            console.log("inserted")
                    })
                    })
                }
                  
             })
        console.log('user disconnected');
      });
      socket.on('chat message',(msg)=>{
          tempChat.push({username:userAdopterId,text:msg,date:new Date()});
          socket.to(room).emit('chat message', msg);
      })
      
  });
  //make a router which checks  
app.get("/chat/:adoptingOrListing/:idUser/:nameUser",(req,res)=>{
    //on disconnect from all send the temp chat to the db ok

    //if(req.session.owner)
    const adoptingOrListing=req.params.adoptingOrListing;
    console.log(req.params);
    const nameLister=req.params.nameUser
    const idLister=req.params.idUser;
   
    const nameAdopter=req.session.owner.name;
    const idAdopter=req.session.owner.ownerId;
   // if(idAdopter !==idLister){}
   if(adoptingOrListing === 'adoption'){
    userAdopterId=idAdopter+"_"+nameAdopter;
    userListerId =idLister+"_"+nameLister;
    console.log(adoptingOrListing);
   }else if(adoptingOrListing === 'listing'){
       console.log(adoptingOrListing);
       userAdopterId=idLister+"_"+nameLister;
        userListerId=idAdopter+"_"+nameAdopter;
    }
    // MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
    //     if (error) {
    //         console.log(error);
    //    };

    //     const db = client.db(dbName);
    //     const chatHistory= db.collection("chatHistory");
    //    
    // })
    res.redirect('/loadChat')
})
app.get("/loadChat",(req,res)=>{res.send(navbar+chat+footer);})
app.get("/chats",(req,res)=>{
    app.use(history.router);
    res.send(navbar+chatHistory+footer);
});

app.get("/messages",(req,res)=>{
    if(userListerId !== 'lobby'){
        MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
            if (error) {
                console.log(error);
           };
    
            const db = client.db(dbName);
            const chatHistory= db.collection("chatHistory");
            chatHistory.findOne({'user1.id':userListerId,'user2.id':userAdopterId},(err,result)=>{
                if(err){console.log(err)}
                if(result !== null){
                console.log(result.messages)
                res.send(result.messages);
                }
                else{
                    const nameLister=userListerId.substr(2,userListerId.length);
                    const nameAdopter=userAdopterId.substr(2,userListerId.length);
                    chatHistory.insertOne({user1:{id:userListerId,name:nameLister},user2:{id:userAdopterId,name:nameAdopter},messages:[]});
                }
            })
     
        })
}
})

app.post("/search",(req,res,next)=>{
    searchZip=[];
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
        if (error) {
            console.log(error);
            res.redirect("/failPage");
        };

        const db = client.db(dbName);
        const owners= db.collection("owners");
        owners.find({ZIP:req.body.zip}).toArray((err,result)=>{
            if(result === null){
                res.redirect("/");
            }
            else{
                for(let i=0;i<result.length;i++){
                searchZip.push(result[i])
                }
            res.redirect("/search");
            }
        })
    })


});

app.get("/search/:zip",(req,res)=>{
    const searchZipDisplay=searchZip;
    searchZip=null;
    if(searchZipDisplay !== null){
    res.json({searchZipDisplay});
    }else{
      
    }
});
app.get("/search",(req,res)=>{
    res.send(navbar+search+footer);
});
app.get("/register",(req,res)=>{
    res.send(navbar+register+footer);
});
app.get("/adoption",(req,res)=>{
    res.send(navbar+adoption+footer);
});
app.get("/adoption/delete/:id",(req,res)=>{
    const adoptionList=req.session.owner.adoptionsList;
    const adoption=adoptionList[req.params.id-1];
    console.log(adoption);
    //find a way to update to update the ids to the correct format
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
        if (error) {
            console.log(error);
            res.redirect("/failPage");
        };
        
        const db = client.db(dbName);
        const owners= db.collection("owners");
   
         owners.updateOne({ownerId:req.session.owner.ownerId},{$pull:{adoptionsList:adoption}},{ multi: true },(err,data)=>{
            if(err){
                console.log(err);
            }
            
            console.log(data.matchedCount+" "+data.modifiedCount+" "+data.upsertedCount+" "+data.result);
        });
        
       //connect to db here and set every
    });
    fs.unlink(__dirname+"/public/images/target/"+req.session.owner.ownerId+"_"+adoption.petId+""+adoption.name+".png",(err)=>{
        if(err){
            console.log(err);
        }
    })
    res.redirect("/refresh");
});

app.post("/updateProfile",(req,res)=>{
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
        if (error) {
            console.log(error);
            res.redirect("/failPage");
        };
        const db = client.db(dbName);
        const owners= db.collection("owners");
        owners.updateOne({ownerId:req.session.owner.ownerId},{$set:{name:req.body.name,email:req.body.email,password:req.body.password,individualOrPound:req.body.individualOrPound,ZIP:req.body.zip,address:req.body.address}},(err,data)=>{
           
            console.log("Success");
        });
       
    })
    req.session.owner.name=req.body.name;
    req.session.owner.email=req.body.email;
    req.session.owner.password=req.body.password;
    req.session.owner.individualOrPound=req.body.individualOrPound;
    req.session.owner.ZIP =req.body.zip;
    req.session.owner.address=req.body.address;

    console.log(req.session.owner);
    res.redirect("/profile");
});
app.post("/adoption",uploadDest.single("image"),(req,res)=>{
  
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
        if (error) {
            console.log(error);
            res.redirect("/failPage");
        };
        const db = client.db(dbName);
        const owners= db.collection("owners");
        owners.findOne({ownerId:req.session.owner.ownerId},(err,result)=>{
        let index= result.adoptionsList.length;
        if(!index){
            owners.updateOne({ownerId:req.session.owner.ownerId},{$push:{adoptionsList:{petId:1,name:req.body.name,breed:req.body.breed,age:req.body.age,size:req.body.size,color:req.body.color,sex:req.body.sex}}});
        }
        else{
          owners.updateOne({ownerId:req.session.owner.ownerId},{$push:{adoptionsList:{petId:index+1,name:req.body.name,breed:req.body.breed,age:req.body.age,size:req.body.size,color:req.body.color,sex:req.body.sex}}});
        }
      });
 
    });
    req.session.owner.adoptionsList.push(req.body);
    const idAdopt=req.session.owner.adoptionsList.length;
    const name=req.session.owner.adoptionsList[idAdopt-1].name;
    console.log(idAdopt);
    console.log(req.session.owner.adoptionsList[idAdopt-1]);
     fs.rename(req.file.path,__dirname+"/public/images/target/"+req.session.owner.ownerId+"_"+idAdopt+""+name+".png",err=>{
               if(err){console.log(err)}
    
            });
    res.redirect("/profile");
})
//make a profile getter for the 
app.get("/profile",(req,res)=>{
    if(req.session.owner){

    res.send(navbar+profile+footer);
    }
});
app.get("/profile/:loggedInProfile",(req,res)=>{
    res.json(req.session.owner);

});

app.post("/register",(req,res)=>{ 
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
        if (error) {
            console.log(error);
            res.redirect("/failPage");
        };
        const db = client.db(dbName);
        const owners= db.collection("owners");
   
      owners.find({}).sort({$natural:-1}).toArray((err,result)=>{

        owners.insertOne({ownerId:result[0].ownerId+1,name:req.body.name,email:req.body.email,password:req.body.password,individualOrPound:req.body.individualOrPound,ZIP:req.body.zip,address:req.body.address,adoptionsList:[]});
     });
     
    });
    res.redirect("/");
})
//when wrong login either send to another page or
app.get("/logout",(req,res)=>{
    req.session.email="";
    req.session.loggedIn=false;
    req.session.loggedOut=true;
    res.redirect("/");
});

app.get("/wrong/:incorrect",(req,res)=>{
    if(req.session.loggedIn === false && req.session.loggedOut=== false){
    res.json({wrong:"WRONG"});
    }
});
app.get("/:correct",(req,res,next)=>{
    if(req.session.email && req.session.loggedIn === true){
    res.json({email:req.session.email});  
    }
});


app.get("/",(req,res)=>{
    res.send(navbar+footer);
});

app.post("/api/logIn",(req,res,next)=>{
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
        if (error) {
            throw new Error(error);
        }
        const db = client.db(dbName);
        const puppies = db.collection("owners");
        // const owners= db.collection("owners");
        puppies.findOne({email:req.body.email},(err,result)=>{
           
            if(result === null){
                req.session.loggedIn=false;
                req.session.loggedOut=false;
                res.redirect("/");
            }else if(req.body.password === result.password){
                db.close;
                req.session.loggedIn=true;
                req.session.loggedOut=false;
                req.session.email=req.body.email;
                req.session.owner=result;
                res.redirect("/")
            }else{
                
                req.session.loggedIn=false;
                req.session.loggedOut=false;
                res.redirect("/");
            }
           res.end();
        })
        
    });
    
});
