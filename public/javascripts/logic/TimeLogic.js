var time = {
  __name: 'hipa.logic.Time',
  _duration1: [0,0,0],
  _passedTime: [0,0,0],
  dateFormat: '{0}:{1}:{2} / {3}:{4}:{5}',
  getCurrent: function(time){
    var year = time.getYear() + 1900;
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var hour = time.getHours();
    var min = time.getMinutes();
    var sec = time.getSeconds();
    return this._format(year, month, date, hour, min, sec);
  },
  init: function() {
    this._passedTime = [0,0,0];
  },
  set: function(duration, passedTime) {
    this._duration1 = this._sec2time(duration);
    this._passedTime = this._sec2time(passedTime);
    console.log(this, this._duration1);
  },
  update: function() {
    this._passedTime[2] = this._passedTime[2] + 1;
    if (this._passedTime[2] === 60) {
      this._passedTime[2] = 0;
      this._passedTime[1] = this._passedTime[1] + 1;
      if (this._passedTime[0] === 60) {
        this._passedTime[1] = 0;
        this._passedTime[0] = this._passedTime[0] + 1;
      }
    }
    return this._format(this._duration1, this._passedTime);
  },
  _format: function(t1, t2){
    return h5.u.str.format(this.dateFormat, this._format_string(t1[0]), this._format_string(t1[1]), this._format_string(t1[2]), this._format_string(t2[0]), this._format_string(t2[1]), this._format_string(t2[2]));
  },
  _format_string: function (s) {
    var str = s.toString();
    return (str.length==1)? '0' + str: str;
  },
  _sec2time: function(tot) {
    var hr = Math.floor(tot/3600);
    var min = Math.floor((tot - 3600*hr)/60);
    var sec = tot - 60*min - 3600*hr;
    return [hr, min, sec];
  }

};

h5.core.expose(time);
