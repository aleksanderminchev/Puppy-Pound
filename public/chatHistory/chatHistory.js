(async function(){
    const ulListings=document.getElementById("listings");
    const response=await fetch("/api/listings")
    const result = await response.json()
        
        result.map((discussions)=>{

            const user2=discussions.user2;
            const li=document.createElement('li');
            li.innerHTML="<a href='/chat/listing/"+user2.id.substring(0,1)+"/"+user2.name+"' class='listing buttons'><button id='chatButton'>"+user2.name+"</button></a>"
            ulListings.appendChild(li);
    
        })
    
})()
(async function(){
    const ulAdoptions=document.getElementById('adoptions');
    const responce = await fetch("/api/adoptions")
    const result = await responce.json()
        if(result){
        result.map((discussions)=>{
            console.log(discussions)
            const user1=discussions.user1;
            const li=document.createElement('li');
           
            li.innerHTML="<a href='/chat/adoption/"+user1.id.substring(0,1)+"/"+user1.name+"' class='listing buttons'><button id='chatButton'>"+user1.name+"</button></a>"
            ulAdoptions.appendChild(li);
        })
    }else{
        const li=document.createElement('li');
        li.innerHTML="<strong>No adoption chats</strong>";
        ulAdoptions.appendChild(li);
    }
    
})()
