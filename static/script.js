$(document).ready(function(){
    console.log("Activated..");
 	
 	function uploadImage(file){
    	console.log("In filestack upload...");
    	var link  = "";

 		const client = filestack.init('AiKHytgzdQOpEXfCa7TYcz');
 		
 		client.upload(file)
		.then(res => {
			console.log('file upload success: ', res);
			link = res["url"];
			console.log(link);
			return link;
		})

		.catch(err => {
			console.log(err)
		});
 	}

    function authAndSend(picture){
    	console.log("In Auth...");

        //filling out config which contains the client id and the services we can access
        var config = {
            'client_id': '52450915676-rc26i689nrng0gi0i7bsle3p9vm9oqt9.apps.googleusercontent.com',
            'scope': [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/glass.timeline',
                'https://www.googleapis.com/auth/glass.location'
            ]
        };
 		
 		// var fileStackLink = uploadImage(picture);

 		// console.log("CDN =" + fileStackLink);

        //authenticating and getting token
        gapi.auth.authorize(config, function (){
            console.log("getting token inside authorize")
            accessToken = gapi.auth.getToken().access_token;
            console.log(accessToken)
 
            var date = new Date();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
           
            var currentTime = ("" + hours + ":" + minutes + ":" + seconds);


            sendImageString = "<img src=\"+ +\"";
            var sendImageString = "<img src=\"https://cdn.filestackcontent.com/yKdLFEQpRhKfM2DoIkr3\"";
            console.log(sendImageString)
 			
 			/* Correct image format for storage
            <img src=\"https://mirror-api-playground.appspot.com/links/filoli-spring-fling.jpg\"
 			*/

            //creating items being pushed to glass and making a json
            var sendString = `<article class=\"photo\">\n  ${sendImageString} width=\"100%\" height=\"100%\">\n  <section>\n    <p class=\"text-auto-size\">\n \n  ${currentTime} </p>\n  <section>\n</article>\n `          
            console.log(sendString);
            let data = {
              "html": sendString,
              "notification": {
                "level": "DEFAULT"
              }
            }
 
            //specifying HTTP specifics and having POST method which inserts to timeline
            var options = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            }
 
            axios.post('https://www.googleapis.com/mirror/v1/timeline', data, options)
                .then((res) => { console.log("RESPONSE RECEIVED: ", res); })
                .catch((err) => { console.log("AXIOS ERROR: ", err); })
        });
    }
 
    function snapshot(currentTime){
        console.log("snapshot..");
       
        var snapshotButton = document.querySelector("#snap");
        var video = window.video = document.querySelector('video');
        var canvas = window.canvas = document.querySelector('canvas');
       
        canvas.width = 480;
        canvas.height = 360;
       
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        var image = canvas.toDataURL("image/png");
 
        var parentNode = document.getElementById("slider-list");
        var time = document.createElement('li');
        var text = document.createTextNode(new Date().toString());
        // text.style.font-color = "red";		
        time.appendChild(text);
       
        //Insert new image node here
        parentNode.appendChild(time);      
 
        var elem = document.createElement("img");
        elem.setAttribute("src", image);
        elem.setAttribute("height", "250");
        elem.setAttribute("width", "300");
   
        //var document.getElementById("camera-roll").appendChild(elem);
        const constraints = {
            video: true
        };
 
        function handleSuccess(stream) {
          video.srcObject = stream;
        }
 
        function handleError(error){
          console.error('Error in video initialization.', error);
        }
 
        navigator.mediaDevices.getUserMedia(constraints)
        .then(handleSuccess).catch(handleError);
 
        return image;
    }
   
    Myo.connect('com.sengupta.neil');  
 
    Myo.on('fist', function(){
        console.log('object gripped');

        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var currentTime = ("" + hours + ":" + minutes + ":" + seconds)
 	
 		//get image 
        var snap = snapshot(currentTime);
		
        authAndSend(snap);
       	
        console.log(currentTime);
 
        $.ajax({
            url: '/myoData',
            data: {
                gestureType: "pickup",
                timestamp: currentTime,
                image: snap
            },
            type: 'POST',
            success: function(response){
                console.log("response sent");
            },
            error: function(error){
                console.log(error);
            }
        });
       
        this.vibrate();
    });
 
    Myo.on('fist_off', function(){
        console.log('object dropped');
 
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var currentTime = ("" + hours + ":" + minutes + ":" + seconds)
 
        var snap = snapshot(currentTime);
        authAndSend(snap);
       	
        console.log(currentTime);
 
        $.ajax({
            url: '/myoData',
            data: {
                gestureType : "drop",
                timestamp : currentTime,
                image: snap
            },
            type: 'POST',
            success: function(response){
                console.log("response sent");
            },
            error: function(error){
                console.log(error);
            }
        });
 
        this.vibrate();
    });
});