(function (){
	$(initialize);

	function initialize(){
    //h5.core.controller('#container', containerController);
    h5.core.controller('#date', dateController);
  }

  var dateController = {
    __name: 'DateController',
    date: date,
    __ready: function(context){
      this._update();
    },
    '#date_button click': function(context, $button){
      this._update();
    },
    _update: function(){
      console.log('update date');
      var current = this.date.getCurrent(new Date());
      this.$find('#current_date').html(current);
    }
  }

  var containerController = {
    __name: 'containerController',
    __construct: function(context){
      //console.log('construct');
    },
    __init: function(context){
      //console.log('init');
    },
    __ready: function(context){
      //console.log('ready');
    },
    '#start_button click': function(context, $button){
      //console.log('start!');
    },

    '#end_button click': function(context, $button){
      //console.log('end!');
    }
  }
})();

