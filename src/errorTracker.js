/**
 * errorTracker
 * 
 * @description  监测页面错误并上报
 * @author       emitremmus0235@163.com
 */

var utils = {
  getType: function(obj) {
    return regs.(Object.prototype.toString.call(obj))[1];
  }
};

var regs = {
  obj: /^\[object\s(.+?)\]$/
};

(function(window, $, undefined) {
  function Tracker() {

  }

  Tracker.prototype.reporter = function(params) {
    if (utils.getType(params) !== 'Object') {
      throw new Error('reporter expect an Object as auguments but got ' + utils.getType(params));
    }
    var img = new Image(),
      o, arr;
    // var paramKeys = ['version', 'crash_time', 'mid', 'user_agent', 'request_url', 'error_msg', 'http_code', 'error_code'];

    for (o in params) {
      if (params.hasOwnProperty(o)) {
        arr.push(o + encodeURIComponent(params[o]));
      }
    }
    img.src = 'http://www.someurl.com/somepic.gif?' + arr.join('&');

    img.onload = function() {
      console.log('错误已上报！');
    }
  }

  if (typeof exports !== "undefined") {
    exports.errorTracker = new Tracker;
  } else {
    return new Tracker();
  }
})(window, jQuery);
