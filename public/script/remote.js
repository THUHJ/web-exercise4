var currentImage = 0; // the currently selected image
var imageCount = 7; // the maximum number of images available

var screenstate = new Map();
var screenlist =[];
var currentImage =0;

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