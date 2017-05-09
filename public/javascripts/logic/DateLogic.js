var date = {
  __name: 'Date',
  dateFormat: '{0}/{1}/{2} {3}:{4}:{5}',
  getCurrent: function(time){
    var year = time.getYear() + 1900;
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var hour = time.getHours();
    var min = time.getMinutes();
    var sec = time.getSeconds();
    return this._format(year, month, date, hour, min, sec);
  },
  _format: function(year, month, date, hour, min, sec){
    return h5.u.str.format(this.dateFormat, year, month, date, hour, min, sec);
  }
};
