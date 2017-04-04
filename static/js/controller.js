(function (){
	$(initialize);

	function initialize(){
		console.log('initialize_controller');
		h5.core.controller('#container', sampleController);
	}

	var sampleController = {  
	  	__name: 'SampleController',  
	  
	  	'#btn click': function(context, $el) {  
	  		console.log('Button is clicked!');
	  	},
	  	'.parent click': function(context, $el) {
     		console.log('parent is clicked!');
  		},
  		'.target click': function(context, $el) {
     		console.log('target is clicked!');
		}
	};
})();