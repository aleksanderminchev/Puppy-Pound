async function openForm() {
    document.getElementById("myForm").style.display = "block";
  };
  
  async function closeForm() {
    document.getElementById("myForm").style.display = "none";
  };
 async function logOut(){
    location.assign("/logout");
 };

  $(document).ready(function(){
    $("#adoption_post").hide();
  });
  $(document).ready(function(){
    $("#profile").hide();
  });
  $(document).ready(function(){
    $("#logout").hide();
  });
  $(document).ready(function(){
    $("#chathistory").hide();
  });
const urlCorrect="/:correct";
        fetch(urlCorrect).then(response => response.json())
        .then( (result) => {
            //console.log('success:', result)
            //  let div=document.getElementById('test');
           // div.innerHTML=`title: ${result.email}<br/>message: ${result.message}`;
            $("#adoption_post").show();
            $("#profile").show();
            $("#logout").show();
            $("#register").hide();
            $("#loginButton").hide();
            $("#chathistory").show();
        }).catch(error => console.log('error:', error));

 const urlIncorrect="/wrong/:incorrect";
        fetch(urlIncorrect)
        .then(response => response.json())
        .then( (result) => {
            //console.log('success:', result)
             let div=document.getElementById('test');
            div.innerHTML=`${result.wrong}`;
            const a="<p>HELLO</p>"
           div.appendChild(a);
         }).catch(error => console.log('error:', error));

