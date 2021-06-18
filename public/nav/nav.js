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
  // console.log("REACHED FIRST");
  $("#adoption_post").hide();
  $("#profile").hide();
  $("#logout").hide();
  $("#chathistory").hide();
});
const urlCorrect="/correct";
(async function (){
const responce= await fetch(urlCorrect)
const result = await responce.json();
    // console.log("REACHED SECND");
    if(result.success){
      $("#adoption_post").show();
      $("#profile").show();
      $("#logout").show();
      $("#register").hide();
      $("#loginButton").hide();
      $("#chathistory").show();
    }else{
      $("#adoption_post").hide();
      $("#profile").hide();
      $("#logout").hide();
      $("#register").show();
      $("#loginButton").show();
      $("#chathistory").hide();
    }
})();

