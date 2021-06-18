//express 
const express=require("express");
const app=express();
//for enviromental variables
require('dotenv').config();
//for session
const session = require('express-session');
//store: new MongoStore(options)
app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized:false,
    resave: true,
    cookie:{secure:false}
}));
//for chat portion
const history=require("./router/chatList");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
//html files folder
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const fs = require("fs");
//for images
const fileReader=require("multer");
const uploadDest=fileReader({
    dest:__dirname+"/public/images/temp/"
});
//loading webpages
const navbar=fs.readFileSync(__dirname+"/public/nav/nav.html","utf-8");
const homepage=fs.readFileSync(__dirname+"/public/homepage/homepage.html","utf-8");
const search= fs.readFileSync(__dirname+"/public/search/search.html","utf-8");
const footer= fs.readFileSync(__dirname+"/public/footer/footer.html","utf-8");
const register=fs.readFileSync(__dirname+"/public/register/register.html","utf-8");
const adoption=fs.readFileSync(__dirname+"/public/adoption/adoption.html","utf-8");
const profile=fs.readFileSync(__dirname+"/public/profile/profile.html","utf-8");
const chat=fs.readFileSync(__dirname+"/public/chat/chat.html","utf-8");
const chatHistory=fs.readFileSync(__dirname+"/public/chatHistory/chatHistory.html","utf-8");
const failure=fs.readFileSync(__dirname+"/public/homepage/failure.html","utf-8");
//connections for the database
const MongoClient = require("mongodb").MongoClient;
const password=process.env.DB_PASSWORD;
const user=process.env.DB_USER;
const url = "mongodb+srv://"+user+":"+password+"@puppyshelter.xfqtn.mongodb.net/puppypound?retryWrites=true&w=majority";
//const url ="mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
const dbName = "puppypound";

const PORT =process.env.PORT
server.listen( PORT || 8080,(err)=>{
    if(err){
        console.log(err);
    }
});
//temp chat holds our conversation untill everyone leaves the room and it is destroyed


//searchZip hold the zip in which we are looking for dogs
let searchZip;
//these IDs are what are used for room creation
let userListerId='lobby';
let userAdopterId='lobby';
//on connection we are put into the lobby_lobby room
io.on('connect', (socket) =>{
    const room=userListerId+"_"+userAdopterId
    socket.join(room);
    //console.log(io.sockets.adapter.rooms);
    io.of("/").adapter.on("delete-room", (rooms) => {
        if(rooms === room){
            console.log(`room ${rooms} destroyed`);
        }
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message',(msg)=>{
        console.log(msg);
        //receive chat message from client
        message={username:msg.userId,text:msg.input,date:new Date()};
        //put temp chat push here
        MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
            if (error) {
            console.log(error);
            res.redirect("/failPage");
            }
    
            const db = client.db(dbName);
            const chatHistory= db.collection("chatHistory");
                // console.log(userListerId);
                // console.log(userAdopterId);
                //input every individual message within the database
                   
            chatHistory.updateOne({'user1.id':userListerId,'user2.id':userAdopterId},{$push:{messages:message}},(data)=>{ 
                console.log("inserted");
                client.close();
            })
                
        })        
        // send to other clients in the room
        socket.to(room).emit('chat message', msg.input);
    })
      
});

  //make a router which checks  
app.get("/chat/:adoptingOrListing/:idUser/:nameUser",(req,res)=>{
    //on disconnect from all send the temp chat to the db ok
    if(req.session.owner.ownerId == req.params.idUser){
        res.redirect("/failPage")
    }
    else if(req.session.loggedIn){

        const adoptingOrListing=req.params.adoptingOrListing;
        //console.log(req.params);
        //user I want to connect to
        const nameLister=req.params.nameUser;
        const idLister=req.params.idUser;
        //current logged in user
        const nameAdopter=req.session.owner.name;
        const idAdopter=req.session.owner.ownerId;

        if(adoptingOrListing === 'adoption'){
            //this if statement is for when you want to adopt someones puppy
            userAdopterId=idAdopter+"_"+nameAdopter;
            userListerId =idLister+"_"+nameLister;
            console.log(adoptingOrListing);
        }else if(adoptingOrListing === 'listing'){  
            //this statement is when you are giving a puppy up for adoption
            console.log(adoptingOrListing);
            userAdopterId=idLister+"_"+nameLister;
            userListerId=idAdopter+"_"+nameAdopter;
        }
        // console.log(userAdopterId)
        // console.log(userListerId)
        res.redirect('/loadChat')
    }else{
        res.redirect('/failPage');
    }
})
app.get("/loadChat",(req,res)=>{
    if(req.session.loggedIn){
        res.send(navbar+chat+footer);
    }else{
        res.redirect("/failPage");
    }
    
})
app.get("/chats",(req,res)=>{
    //router to find the list
    if(req.session.loggedIn){
        app.use(history.router);
        res.send(navbar+chatHistory+footer);
    }else{
        res.redirect("/failPage")
    }

});

app.get("/messages",(req,res)=>{
    if(userListerId !== 'lobby'){
        MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
            if (error) {
                console.log(error);
                res.redirect("/failPage");
            };
    
            const db = client.db(dbName);
            const chatHistory= db.collection("chatHistory");
            //finds our messages between users
            chatHistory.findOne({'user1.id':userListerId,'user2.id':userAdopterId},(err,result)=>{
                if(err){
                    console.log(err)
                    res.redirect("/failPage");
                }
                if(result !== null){
                console.log(result.messages)
                res.send(result.messages);
                }else{
                    const nameLister=userListerId.substr(2,userListerId.length);
                    const nameAdopter=userAdopterId.substr(2,userListerId.length);
                    chatHistory.insertOne({user1:{id:userListerId,name:nameLister},user2:{id:userAdopterId,name:nameAdopter},messages:[]});
                }
                client.close();
            })
        })
    }else{
        res.redirect("/failPage");
    }
})
//post request from the client to find all listings on the given address
app.post("/search",(req,res)=>{
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
            }else{
                for(let i=0;i<result.length;i++){
                   searchZip.push(result[i])
                }
            
            }
            client.close();
        })
        
        res.redirect("/search");
    })
    //redirect but close cursor before 
});
//get the results for looking at a certain zip sent to the client
app.get("/search/zip",(req,res)=>{
    const searchZipDisplay=searchZip;
    searchZip=null;
    if(searchZipDisplay !== null){
        res.json({searchZipDisplay});
    }else{
        res.redirect("/failPage")
    }
});
//search page
app.get("/search",(req,res)=>{
    res.send(navbar+search+footer);
});
//register page
app.get("/register",(req,res)=>{
    res.send(navbar+register+footer);
});
//addoption page
app.get("/adoption",(req,res)=>{
    if(req.session.loggedIn){
        res.send(navbar+adoption+footer);
    }else{
        res.redirect("/failPage");
    }
    
});
//fix ids
//deletes the listing from the database
app.get("/adoption/delete/:id",(req,res)=>{
    if(req.session.loggedIn){
        const adoptionList=req.session.owner.adoptionsList;
        const adoption=adoptionList[req.params.id];
        // console.log(adoption);
        //delete from the adoptionsList in the session then delete it 
        MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
            if (error) {
                console.log(error);
                res.redirect("/failPage");
            };
            const db = client.db(dbName);
            const owners= db.collection("owners");
            adoptionList.splice(req.params.id,1);
            adoptionList.map((object)=>{
                if(object.petId> req.params.id){
                    object.petId -= 1;
                }
                
            });
            owners.updateOne({ownerId:req.session.owner.ownerId},{$set:{adoptionsList:adoptionList}},(err,data)=>{
                if(err){
                    console.log(err);
                    res.redirect("/failPage");
                }
                client.close();
            });
        });
        //removes the images on deletion 
        fs.unlink(__dirname+"/public/images/target/"+req.session.owner.ownerId+"_"+adoption.name+".png",(err)=>{
            if(err){
                console.log(err);
                res.redirect("/failPage");
            }
        });
        res.redirect("/profile");
    }else{
        res.redirect("/failPage");
    }

});
//updates the profile
app.post("/updateProfile",(req,res)=>{
    if(req.session.loggedIn){
        MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
            if (error) {
                console.log(error);
                res.redirect("/failPage");
            };
            const db = client.db(dbName);
            const owners= db.collection("owners");
            //use the ownerId to find the correct one to update
            owners.updateOne({ownerId:req.session.owner.ownerId},{$set:{
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                individualOrPound:req.body.individualOrPound,
                ZIP:req.body.zip,
                address:req.body.address
            }},(err,data)=>{
                console.log("Success");
                client.close();
            });
            
        });
        //updates the session properties and logging us out 
        req.session.loggedIn=false;
        res.redirect("/");
    }else{
        res.redirect("/failPage")
    }

});
//creating adoptions 
app.post("/adoption",uploadDest.single("image"),(req,res)=>{
    let index;
    if(req.session.loggedIn){
        MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
            if (error) {
                console.log(error);
                res.redirect("/failPage");
            };
            const db = client.db(dbName);
            const owners= db.collection("owners");
            //when updating the list I need the length of adoptions
            owners.findOne({ownerId:req.session.owner.ownerId},(err,result)=>{
                index= result.adoptionsList.length;
                owners.updateOne({ownerId:req.session.owner.ownerId},{$push:{adoptionsList:{
                    petId:index,
                    name:req.body.name,
                    breed:req.body.breed,
                    age:req.body.age,
                    size:req.body.size,
                    color:req.body.color,
                    sex:req.body.sex
                }}});
                //updates the adoptionsList which is part of the session.owner
                req.session.owner.adoptionsList.push({
                    petId:index,
                    name:req.body.name,
                    breed:req.body.breed,
                    age:req.body.age,
                    size:req.body.size,
                    color:req.body.color,
                    sex:req.body.sex
                });
                const idAdopt=req.session.owner.adoptionsList.length-1;
                //console.log(req.session.owner.adoptionsList); 
                const name=req.session.owner.adoptionsList[idAdopt].name;
                // console.log(idAdopt);
                // console.log(req.session.owner.adoptionsList[idAdopt]);
                //moves the tempfile into target and renames it
                fs.rename(req.file.path,__dirname+"/public/images/target/"+req.session.owner.ownerId+"_"+name+".png",err=>{
                        if(err){
                            console.log(err);
                            res.redirect("/failPage");
                        }
                    });
        });
        });
        res.redirect("/profile")
    }else{
        res.redirect("/failPage");
    }
})


//make a profile getter for the 
app.get("/profile",(req,res)=>{
    if(req.session.loggedIn){
        res.send(navbar+profile+footer);
    }else{
        res.redirect("/failPage");
    }
});
//updates the profile and returns it to display to the page
app.get("/profile/loggedInProfile",(req,res)=>{
    if(req.session.loggedIn){
        MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
            if (error) {
                console.log(error);
                res.redirect("/failPage");
            };
            const db = client.db(dbName);
            const owners= db.collection("owners");
            owners.findOne({ownerId:req.session.owner.ownerId},(err,result)=>{
                if(err){
                    console.log(err);
                    res.redirect("/failPage");
                }
                req.session.owner=result;
                client.close();
                res.json(req.session.owner);
            })
            
        })
        
    }else{
        res.redirect("/failPage");
    }
 
});
//registers a new account
app.post("/register",(req,res)=>{ 
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
        if (error) {
            console.log(error);
            res.redirect("/failPage");
        };
        const db = client.db(dbName);
        const owners= db.collection("owners");
        //get the array length of the owners and insert at the last position
        owners.find({}).toArray((err,result)=>{
            if(err){
                res.redirect("/failPage");
            }
            owners.insertOne({
                ownerId:result.length+1,
                name:req.body.name,email:req.body.email,
                password:req.body.password,
                individualOrPound:req.body.individualOrPound,
                ZIP:req.body.zip,address:req.body.address,
                adoptionsList:[]
            });
            client.close();
     });
     
    });
    res.redirect("/");
})
//when something fails redirect to here
app.get("/failPage",(req,res)=>{
    res.send(navbar+failure+footer)
})
//sets the owner to null and logged in to false
app.get("/logout",(req,res)=>{
    req.session.owner=null;
    req.session.loggedIn=false;
    res.redirect("/");
});
//used for fetch requests from nav to show correct nav buttons
app.get("/correct",(req,res,next)=>{
    if(req.session.loggedIn){
        res.json({success:true});  
    }else{
        res.json({success:false});
    }
});
//homepage
app.get("/",(req,res)=>{
    res.send(navbar+homepage+footer);
});
//login if successful redirects to the homepage and sets the owner within session and loggedIn to true
app.post("/api/logIn",(req,res,next)=>{
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
        if (error) {
            console.log(error);
            res.redirect("/failPage");
        }
        const db = client.db(dbName);
        const puppies = db.collection("owners");
        puppies.findOne({email:req.body.email},(err,result)=>{
           
            if(result === null){
                req.session.loggedIn=false;
                res.redirect("/failPage");
            }else if(req.body.password === result.password){
                db.close;
                req.session.loggedIn=true;
                req.session.owner=result;
                req.session.owner.password=null;
                res.redirect("/")
            }else{  
                req.session.loggedIn=false;
                res.redirect("/failPage");
            }
            client.close();
        })
      
    });
    
});
