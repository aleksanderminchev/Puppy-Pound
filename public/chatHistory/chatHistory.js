let currentLoggedInUser;
fetch("/profile/:loggedInProfile").then(response => response.json()) .then( (result) => {
    currentLoggedInUser=result.ownerId+"_"+result.name;
  });
const ulListings=document.getElementById("listings");
fetch("/api/listings").then(response => response.json()).then((result) => {
    
    result.map((discussions)=>{
       
        const user1=discussions.user1;
        const user2=discussions.user2;
        const li=document.createElement('li');
        li.innerHTML="<a href='/chat/listing/"+user2.id.substring(0,1)+"/"+user2.name+"' class='listing buttons'><button id='chatButton'>"+user2.name+"</button></a>"
        ulListings.appendChild(li);

    })


});
const ulAdoptions=document.getElementById('adoptions');
fetch("/api/adoptions").then(response => response.json()).then((result) => {
    if(result){
    result.map((discussions)=>{
        const user1=discussions.user1;
        const user2=discussions.user2;
        const li=document.createElement('li');
       
        li.innerHTML="<a href='/chat/adoption/"+user1.id.substring(0,1)+"/"+user1.name+"' class='listing buttons'><button id='chatButton'>"+user1.name+"</button></a>"
        ulAdoptions.appendChild(li);
    })
}else{
    const li=document.createElement('li');
    li.innerHTML="<strong>No adoption chats</strong>";
    ulAdoptions.appendChild(li);
}

});