/**
 * errorTracker
 * 
 * @description  监测页面错误并上报
 * @author       emitremmus0235@163.com
 */

var errorTracker = (function(window, $, undefined) {
  var ua = window.navigator.userAgent;
  var regs = {};

  var utils = {
    getType: function(obj) {
      return Object.prototype.toString.call(obj);
    }
  };

  var option = {
    reportUrl: 'http://www.someurl.com/somepic.gif',
    errorHandler: function() {}
  };

  function Tracker(opts) {
    Tracker.opts = $.extend({}, option, opts);
  }

  // 错误栈，默认五分钟内重复
  Tracker.errorStack = [];

  Tracker.reporter = function(params) {
    if (utils.getType(params) !== '[object Object]') {
      throw new Error('reporter expect an Object as auguments');
    }
    var img = new Image(),
      arr = [],
      o;

    for (o in params) {
      if (params.hasOwnProperty(o)) {
        arr.push(o + '=' + encodeURIComponent(params[o]));
      }
    }
    img.src = Tracker.opts.reportUrl + '?' + arr.join('&');

    img.onload = function() {
      console.log('错误已上报！');
    }
  }

  Tracker.prototype.watchSyntaxError = function() {
    var _error = window.onerror;

    window.onerror = function(message, source, line, col, error) {
      Tracker.reporter({
        msg: message,
        url: source,
        line: line,
        col: col
      });

      // 执行原先的onerror方法
      _error && error.apply(window, arguments);
    }
  }

  return Tracker;
})(window, jQuery);

if (typeof module !== 'undefined') {
  module.exports = errorTracker;
}
