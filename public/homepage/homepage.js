const images=["home1.png","home2.png","home3.png"]
let index=0;

$(function(){
        $("#page1").hide();
        $("#page2").hide();
    $("#left").on('click',function(){
        $("#page"+index).hide();
        $("#maincontent").fadeOut('slow'| 500,function(){
            $("#maincontent").css('background-image',"url(../homepage/"+images[index]+")");
            
        });
        if(index === 0){
            index=2 ;
        }else{
            index -= 1;
        }
        $("#page"+index).show();
        $("#maincontent").fadeIn('slow'| 500,function(){
            $("#maincontent").css('background-image',"url(../homepage/"+images[index]+")");
            
        })
       

    })
    $("#right").on('click',function(){
        $("#page"+index).hide();
        $("#maincontent").fadeOut('slow'| 500,function(){
            $("#maincontent").css('background-image',"url(../homepage/"+images[index]+")");
           
        })
        if(index === 2){
            index=0;
           
        }else{
            index += 1 ;
        }
        $("#page"+index).show();
        $("#maincontent").fadeIn('slow'| 500 ,function(){
            $("#maincontent").css('background-image',"url(../homepage/"+images[index]+")");
            
        });
    })
   
});
setInterval(function(){
    $("#page"+index).hide();
    index +=1;
    if(index > 2){
        index=0;
    }
  
    $("#maincontent").fadeOut('slow'| 500,function(){
        $("#maincontent").css('background-image',"url(../homepage/"+images[index]+")");
    });
    $("#page"+index).show();
    $("#maincontent").fadeIn('slow'| 500 ,function(){
        $("#maincontent").css('background-image',"url(../homepage/"+images[index]+")");

        
    });
},7000);


