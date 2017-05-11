var currentImage = 0; // the currently selected image
var imageCount = 7; // the maximum number of images available

var screenstate = new Map();
var screenlist =[];
var currentImage =0;



var mytat = new tiltandtap({
    tiltLeft :  {callback:prev_image},
    tiltRight : {callback:next_image},
    
});
var p=false;
function cancel_protect()
{
    p=false;
}
function prev_image()
{
    //alert("Asd");
    if (p==true)
    {
        return;
    }
    if (currentImage!=0) currentImage--;
    showImage(currentImage);

    p=true;
    setTimeout("cancel_protect()",500); 
}
function next_image() {
    if (p==true)
    {
        return;
    }
    if (currentImage!=6) currentImage++;
    showImage(currentImage);
    p=true;
    setTimeout("cancel_protect()",500); 
    
}


function assignimg()
{
    var imgid = currentImage;
    for (i in screenlist)
    {
       
        var name = screenlist[i];
        if (screenstate[name]=="Disconnect")
        {
            var socket = io();
           //alert(name+" "+imgid);
            socket.emit("change img", [name,imgid]);
            if (imgid<6) imgid=imgid+1;
        }
        
    }
}

$(window).bind('beforeunload', function(){  
    
    for (i in screenlist)
    {
       
        var name = screenlist[i];
        if (screenstate[name]=="Disconnect")
        {
            var socket = io();
           //alert(name+" "+imgid);
            socket.emit("change img", [name,-1]);
            
        }
        
    }
     //return false; 
});


function changestate(name)
{


    var butt = $('#'+name);


    var state = butt.text();
    if (state=="Connect")
    {
        screenstate[name]="Disconnect";
        butt.text("Disconnect");
        assignimg();
    }
    else
    {
        screenstate[name]="Connect";
        butt.text("Connect");
        
        
        var socket = io();
        socket.emit("change img", [name,-1]);
        assignimg();
        
    }
    //alert("change"+" "+name+" "+screenstate[name])

}
var p2=false;
function cancel_protect2()
{
   
    p2=false;
}
$(function () {
        var socket = io();
        
        socket.on('update', function(namelist){ 
            screenlist = namelist;
            $('#menu').html("");

            var newmap = new Map();
            for (i in namelist)
            {
                var name = namelist[i];
                if (screenstate[name]==null)
                {
                    newmap[name]="Connect";
                }
                else
                    newmap[name]=screenstate[name];
            }
            screenstate = newmap;
            for (i in namelist)
            {
                var name = namelist[i];
                var mybutton = "<button id="+name+" onclick='changestate(\""+name+"\")'>"+screenstate[name]+"</button>"
                $('#menu').append("<li>"+name+mybutton+"</li>");
            }
        });

        if (window.DeviceOrientationEvent)
        {
            window.addEventListener('deviceorientation',function(eventData)
            {
                if (p2) return;

                var beta_angle = eventData.beta;
               
                var size = "100%";
                if (beta_angle<15)
                {
                    size = "100%";
                }
                else if (beta_angle<40)
                {
                    size = "80%";
                }
                else if (beta_angle<75)
                {
                    size = "60%";
                }
                else
                    size = "40%";
                var socket = io();
                socket.emit("change img", [name,-1]);
                for (i in screenlist)
                {
                   
                    var name = screenlist[i];
                    if (screenstate[name]=="Disconnect")
                    {
                        var socket = io();
                        socket.emit("change size", [name,size]);                       
                    }
                    
                }
                p2=true;
                setTimeout("cancel_protect2()",100); 


                
            })
        }


        // socket.on('next prev image', function(msg){
        //     next_prev = msg[0];
        //     name = msg[1];
        //     //alert(next_prev+" "+name+" "+screenstate[name])
        //     if (screenstate[name]=="Disconnect")
        //     {
        //         currentImage += next_prev;
        //         if (currentImage==-1) currentImage=0;
        //         if (currentImage==7) currentImage=6;
        //         //alert(currentImage)
        //         showImage(currentImage)
        //     } 
        //});
});


function showImage (index){
    // Update selection on remote
    currentImage = index;
    var images = document.querySelectorAll("img");
    document.querySelector("img.selected").classList.toggle("selected");
    images[index].classList.toggle("selected");

    assignimg();
    // Send the command to the screen
    // TODO
    //alert("TODO send the index to the screen"+index)
}

function initialiseGallery(){
    var container = document.querySelector('#gallery');
    var i, img;
    for (i = 0; i < imageCount; i++) {
        img = document.createElement("img");
        img.src = "images/" +i +".jpg";
        document.body.appendChild(img);
        var handler = (function(index) {
            return function() {
                showImage(index);
            }
        })(i);
        img.addEventListener("click",handler);
    }

    document.querySelector("img").classList.toggle('selected');
    assignimg();
}

document.addEventListener("DOMContentLoaded", function(event) {
    initialiseGallery();

    document.querySelector('#toggleMenu').addEventListener("click", function(event){
        var style = document.querySelector('#menu').style;
        style.display = style.display == "none" || style.display == ""  ? "block" : "none";
    });
    connectToServer();
});

function connectToServer(){
    var socket = io();
    socket.emit('remote', "all");
    // TODO connect to the socket.io server
}