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
var p=false;
function cancel_protect()
{
	p=false;
}
function prev_image()
{
	if (p==true)
	{
		return;
	}
    var socket = io();
    socket.emit('next prev image', [-1,devicename]);
    p=true;
    setTimeout("cancel_protect()",1000); 
}
function next_image() {
	if (p==true)
	{
		return;
	}
    var socket = io();
    socket.emit('next prev image', [1,devicename]);
    p=true;
    setTimeout("cancel_protect()",1000); 
    
}

$(function () {
        devicename = getQueryParams().name;
        var socket = io();
        socket.on(devicename, function(msg){
            if (msg==-1) 
            {
                clearImage();
            }
            else
            {
                showImage(msg);
            }
           
        });
        if (window.DeviceOrientationEvent)
        {
        	window.addEventListener('deviceorientation',function(eventData)
        	{
        		var beta_angle = eventData.beta;
        		
        		var img = document.querySelector('#image');
        		if (beta_angle<15)
        		{
        			img.setAttribute("width", "100%");
        		}
        		else if (beta_angle<40)
        		{
        			img.setAttribute("width", "80%");
        		}
        		else if (beta_angle<75)
        		{
        			img.setAttribute("width", "60%");
        		}
        		else
        			img.setAttribute("width", "40%");


        		
        	})
        }



        
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