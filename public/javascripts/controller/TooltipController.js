
var tooltipController = {
  __name: 'hipa.controller.TooltipController',
  __ready: function(context){
    console.log('tooltip ready');
  },

  '#results span click': function(context, $button){
    console.log($button.html());
    this._search($button.html());
  },

  _search: function(keyword){
    $('#tooltip-results').html('');
    var handleSearch = this._handleSearch;
    $.ajax({
      url: '//en.wikipedia.org/w/api.php',
      data: {
          action: 'query',
          list: 'search',
          srsearch: keyword,
          format: 'json'
      },
      dataType: 'jsonp',
      success: handleSearch
    });
  },

  _handleSearch: function(result){
    for (var i = 0; i < 3; i++){
      var r = result.query.search[i];
      var title = r.title;
      var text = r.snippet;
      var url = "https://en.wikipedia.org/wiki/" + title.replace(" ", "_");

      var $url = $('<a>')
        .attr("href", url)
        .attr("target", "_blank")
        .text(title);

      $('#tooltip-results').append($url);
      document.getElementById("tooltip-results").innerHTML += " " + text + "<br />";
    }
  }
};

h5.core.expose(tooltipController);
