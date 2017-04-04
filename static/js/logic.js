(function (){
	$(initialize);

	function initialize(){
		console.log('initialize_logic');
		var recognition = new webkitSpeechRecognition();
		recognition.lang = "en-GB";
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.onresult = function(event) { 
		  	console.log(event);
		}
		recognition.start();
		console.log('recognition start');
	}

	
})();