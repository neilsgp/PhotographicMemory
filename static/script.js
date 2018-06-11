$(document).ready(function(){
	console.log("Activated..");

	
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
		var text = document.createTextNode( new Date().toString() );
		// text.style.font-color = "red";
		time.appendChild(text);
		
		//Insers new image node here
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

		var snap = snapshot(currentTime);
		
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