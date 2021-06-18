(async function(){
  const profileInfo="/profile/loggedInProfile";
  const responce= await fetch(profileInfo)
  const result = await responce.json()
      //inputs and form
      console.log(result);
      const div=document.getElementById('profileInfo');
      const form=document.createElement("form");
      form.method="POST";
      form.action="/updateProfile";
      form.classList.add("form-profile");
      const name=document.createElement("input");
      const email=document.createElement("input");
      const password=document.createElement("input");
      const individualOrPound=document.createElement("input");
      const ZIP=document.createElement("input");
      const address=document.createElement("input");
      //labels for the inputs
      const label1=document.createElement("label");
      const label2=document.createElement("label");
      const label3=document.createElement("label");
      const label4=document.createElement("label");
      const label5=document.createElement("label");
      const label6=document.createElement("label");
      //for name
      label1.innerHTML="Name: <br/>"
      name.id="name";
      name.value=result.name;
      name.type="text";
      name.name="name";
      label1.appendChild(name);
      form.appendChild(label1);
      //for email
      label2.for="email";
      label2.innerHTML="Email:<br/> "
      email.id="email";
      email.value=result.email;
      email.name="email";
      email.type="email";
      label2.appendChild(email);
      form.appendChild(label2);
      //for password
      label3.for="password";
      label3.innerHTML="Password:<br/>  "
      password.name="password";
      password.type="password";
      label3.appendChild(password);
      form.appendChild(label3);
  
      //for poundor individual
      label4.innerHTML="Individual Or Pound:<br/> "
      individualOrPound.id="name";
      individualOrPound.value=result.individualOrPound;
      individualOrPound.type="text";
      individualOrPound.name="individualOrPound";
      label4.appendChild(individualOrPound);
      form.appendChild(label4);
      //for zip code
      label5.innerHTML="Zip code:<br/> "
      ZIP.id="name";
      ZIP.value=result.ZIP;
      ZIP.type="text";
      ZIP.name="zip";
      label5.appendChild(ZIP);
      form.appendChild(label5);
      //for address   
      label6.innerHTML="Address:<br/> "
      address.id="name";
      address.value=result.address;
      address.type="text";
      address.name="address";
      label6.appendChild(address);
      form.appendChild(label6);
      //for submit button for the form
      const submitForm=document.createElement("button");
      submitForm.type="submit";
      submitForm.innerText="Update Profile";
      form.appendChild(submitForm);
      div.appendChild(form);
  
      
      //adoption list with things to change
      const rightSide=document.getElementById("rightSide");
      result.adoptionsList.map((adoption)=>{
        const adoptionsList=document.createElement("li");
        const buttonDelete=document.createElement("button");
        let a=document.createElement("a");
        console.log(adoption);
        a.href="/adoption/delete/"+adoption.petId;
        a.appendChild(buttonDelete);
        buttonDelete.innerText="Delete";
        const line =document.createElement("hr")
        line.classList.add("line");
        adoptionsList.innerHTML="<strong> Dog name: </strong>"+adoption.name+" <strong class=text-right>Breed: </strong>"+adoption.breed+
        "<strong> Age: </strong>"+adoption.age+"            <strong class=text-right> Size: </strong> " +adoption.size
        +"  <strong> Color: </strong> "+adoption.color+"     <strong class=text-right>  Sex: </strong> "+adoption.sex+"<br/>";
        rightSide.appendChild(line);
        rightSide.appendChild(adoptionsList);
        adoptionsList.appendChild(a);
      });
})()

