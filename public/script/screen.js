var devicename; // the name of this screen and specified in the URL
var imageCount = 7; // the maximum number of images available
var now_image = -1;
document.addEventListener("DOMContentLoaded", function(event) {
    devicename = getQueryParams().name;
    if (devicename) {
        var text = document.querySelector('#name');
        text.textContent = devicename;
    }

    connectToServer();
});

var mytat = new tiltandtap({
    tiltLeft :  {callback:prev_image},
    tiltRight : {callback:next_image},
    
});

function prev_image()
{
    var socket = io();
    socket.emit('next prev image', [-1,devicename]);
}
function next_image() {
    //if (now_image<6) now_image=now_image+1;
    //showImage(now_image);
    var socket = io();
    socket.emit('next prev image', [1,devicename]);
    
}

$(function () {
        devicename = getQueryParams().name;
        var socket = io();
        //alert(devicename);
        socket.on(devicename, function(msg){
           // alert("msg");
            if (msg==-1) 
            {
                clearImage();
            }
            else
            {
                showImage(msg);
            }
           
        });
        
});

function showImage (index){
    now_image = index;
    var img = document.querySelector('#image');
    var msg = document.querySelector('#msg');
    if (index >= 0 && index <= imageCount){
        img.setAttribute("src", "images/" +index +".jpg");
        msg.style.display = 'none';
        img.style.display = 'block';
    }
}

function clearImage(){
    var img = document.querySelector('#image');
    var msg = document.querySelector('#msg');
    img.style.display = 'none';
    msg.style.display = 'block';
}

function getQueryParams() {
    var qs =  window.location.search.split("+").join(" ");

    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}


function connectToServer(){
     var socket = io();
     devicename = getQueryParams().name;
     if (devicename)
        socket.emit('login', devicename);
    // TODO connect to the socket.io server
}