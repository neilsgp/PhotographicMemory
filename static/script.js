$(document).ready(function(){
	console.log("Activated..");

	function snapshot(){
		console.log("snapshot..");
		
		var snapshotButton = document.querySelector("#snap");
		var video = window.video = document.querySelector('video');
		var canvas = window.canvas = document.querySelector('canvas');
		
		canvas.width = 480;
		canvas.height = 360;
		
		snapshotButton.onclick = function() {
			console.log("button click");
  			canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
		};

		const constraints = {
			video: true
		};

		function handleSuccess(stream) {
		  video.srcObject = stream;
		}

		function handleError(error) {
		  console.error('Error in video initialization.', error);
		}

		navigator.mediaDevices.getUserMedia(constraints).
		then(handleSuccess).catch(handleError);
	}
	
	snapshot();
	Myo.connect('com.sengupta.neil');	

	Myo.on('fist', function(){
		console.log('object gripped');
		takeSnapshot();
		var date = new Date();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		var currentTime = ("" + hours + ":" + minutes + ":" + seconds)
		console.log(currentTime);

		$.ajax({
			url: '/myoData',
			data: {
				gestureType: "pickup",
				timestamp: currentTime
			},
			type: 'POST',
			success: function(response){
				console.log(response);
			},
			error: function(error){
				console.log(error);
			}
		});
		
		this.vibrate();
	});

	Myo.on('fist_off', function(){
		console.log('object dropped');
		takeSnapshot();
		var date = new Date();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		var currentTime = ("" + hours + ":" + minutes + ":" + seconds)
		console.log(currentTime);

		$.ajax({
			url: '/myoData',
			data: {
				"gestureType": "drop",
				"timestamp": currentTime
			},
			type: 'POST',
			success: function(response){
				console.log(response);
			},
			error: function(error){
				console.log(error);
			}
		});

		this.vibrate();
	});
});