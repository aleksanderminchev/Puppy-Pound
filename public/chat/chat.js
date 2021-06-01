const socket=io();

 function formatDate(){
  let currentDate= new Date();
  const day=currentDate.getDate();
  const month=currentDate.getMonth();
  const year=currentDate.getFullYear();
  const hours=currentDate.getHours();
  const minutes=currentDate.getMinutes();
 
  return day+"."+month+"."+year+" "+hours+":"+minutes;
}
socket.on("connect_error", (err) => {
    if (err.message === "invalid username") {
    }
  });
let currentLoggedInUser;
const form=document.getElementById("form-messages");
const input=document.getElementById("input");
fetch("/profile/:loggedInProfile").then(response => response.json()) .then( (result) => {
  currentLoggedInUser=result.ownerId+"_"+result.name;
  
});
  fetch("/messages").then(response => response.json()) .then( (result) => {
    console.log(result);

  result.map((text)=>{
    console.log(text);
    let username=text.username
    const message=document.createElement('li');
    message.innerHTML=text.text;
    const date= document.createElement('li');
    const convert=new Date(text.date);
    date.innerHTML=convert.getDate()+"."+convert.getMonth()+"."+convert.getFullYear()+" "+convert.getHours()+":"+convert.getMinutes();
    date.classList.add('date');
    if( currentLoggedInUser === username){
      message.classList.add('sent');
    }else{
      message.classList.add('received');
    }
    message.appendChild(date);
    messages.appendChild(message);
  })
  });
  

form.addEventListener('submit',(e)=>{
    console.log(input.value);
    const item = document.createElement('li');
    item.innerHTML =input.value;
    item.classList.add('sent');

    const date= document.createElement('li');
    date.innerHTML=formatDate();
    date.classList.add('date');
    item.appendChild(date);
    messages.appendChild(item);
    e.preventDefault();
    if(input.value){
        socket.emit('chat message',input.value)
        input.value='';
    }
})

socket.on('chat message',(msg)=> {
    console.log(msg);
    const item = document.createElement('li');
    item.innerHTML = msg;
    item.classList.add('received');
    const dateReceived= document.createElement('li');
    dateReceived.innerHTML=formatDate();
    dateReceived.classList.add('date');
    item.appendChild(dateReceived);
    messages.appendChild(item);
    window.scrollTo(0, -document.body.scrollHeight);
  });
