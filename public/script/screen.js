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
 
function changesize(size)
{
    
    var img = document.querySelector('#image');
    img.setAttribute("width", size);
}
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
    //alert("woc")
    var socket = io();
    devicename = getQueryParams().name;
    if (devicename)
    {
        socket.emit('login', devicename);
    }
    socket.on(devicename, function(msg){
        if (msg[0]=='img')
        {
            if (msg[1]==-1) 
            {
                clearImage();
            }
    
            showImage(msg[1]);
        }
        else
        {
            changesize(msg[1])
        }
    });    
}