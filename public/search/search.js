const zip="/search/:zip";
fetch(zip).then(response => response.json())
.then( (result) => {
  if(!result){
    const wrong=document.createElement("h2");
    wrong.innerHTML="No dogs for adoption have been found at this zip code";
    div.appendChild(wrong);
    
  }else{
    const div=document.getElementById('test');
    console.log(result.searchZipDisplay);
    result.searchZipDisplay.map((arrayElement)=>{
   
        //const indivudualDiv=document.createElement("div");
       arrayElement.adoptionsList.map((displayObject)=>{

        const ul=document.createElement("ul");
      //  const ul2=document.createElement("ul"); 

        const color =document.createElement("li");
        color.innerHTML=`<strong>  Color:</strong>    ${displayObject.color}`;

        const name= document.createElement("li");
        name.innerHTML=`<strong>Name:</strong> ${displayObject.name}`;

        const age=document.createElement("li");
        age.innerHTML=`<strong> Age:</strong>      ${displayObject.age}`;

        const size =document.createElement("li");
        size.innerHTML=`<strong>Size:</strong>  ${displayObject.size}`;

        const sex=document.createElement("li");
        sex.innerHTML=`<strong> Sex:</strong>  ${displayObject.sex}`;

        const breed=document.createElement("li");
        breed.innerHTML=`<strong>Breed:</strong> ${displayObject.breed}`;
        const img=document.createElement("img");
        img.src="../images/target/"+arrayElement.ownerId+"_"+displayObject.petId+""+displayObject.name+".png";
        img.classList="img";
        const chat=document.createElement("a");
        chat.href="/chat/adoption/"+arrayElement.ownerId+"/"+arrayElement.name;
        chat.innerHTML="<button>Contact</button>"
        ul.appendChild(name); ul.appendChild(breed);
        ul.appendChild(color); ul.appendChild(age);
        
        ul.appendChild(size); ul.appendChild(img);
        ul.appendChild(chat);
        
        div.appendChild(ul);
             
      
            
        });
    });
  } 
}).catch(error => console.log('error:', error));