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

  Tracker.reporter = function(params) {
    if (utils.getType(params) !== '[object Object]') {
      throw new Error('reporter expect an Object as auguments');
    }
    var img = new Image(),
      arr = ['user_agent=' + ua],
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
        position: line + '-' + col,
        http_code: 200
      });

      // 执行原先的onerror方法
      _error && _error.apply(window, arguments);
    }
  }

  Tracker.prototype.watchAjaxFailure = function() {
    //备份jquery的ajax方法
    var _ajax = $.ajax;

    //重写jquery的ajax方法
    $.ajax = function(opt) {
      opt = opt || {};
      //备份opt中error和success，complete方法
      var fn = {
        complete: function(XMLHttpRequest, textStatus) {}
      }
      if (opt.complete) {
        fn.complete = opt.complete;
      }

      //扩展增强处理
      var _opt = $.extend(opt, {
        complete: function(XMLHttpRequest, textStatus) {
          var _status = XMLHttpRequest.status,
            _responseText = XMLHttpRequest.responseText,
            _statusText = XMLHttpRequest.statusText,
            request_url = this.url,
            error_msg, http_code;

          // 请求
          if (_status === 0) {
            error_msg = '请求未发出';
            http_code = 0;
          } else if (/^(5|4)\d{2}/.test(_status)) {
            error_msg = _statusText;
            http_code = _status;
          }

          if (!!http_code) {
            Tracker.reporter({
              msg: error_msg,
              url: request_url,
              position: '',
              http_code: http_code
            });
            fn.complete(arguments);
          }

        }
      });
      return _ajax(_opt);
    };

    // 重写$.get $.getScript $.getJSON $.post
    $.each(['get', 'post'], function(i, method) {
      $[method] = function() {
        var _url = arguments[0],
          _type = method,
          _success, _data, _dataType;

        // 如果第二个参数是回调函数，说明没有传参数或者参数放到了url后面
        if ($.isFunction(arguments[1])) {
          _data = undefined;
          _success = arguments[1];
          _dataType = arguments[2];
        } else {
          _data = arguments[1];
          _success = arguments[2];
          _dataType = arguments[3];
        }

        $.ajax({
          url: _url,
          type: _type,
          data: _data,
          success: _success,
          dataType: _dataType
        });
      }
    });

    $.getScript = function(url, success) {
      return $.get(url, undefined, success, 'script');
    }

    $.getJSON = function(url, data, success) {
      return $.get(url, data, success, 'json');
    }
  }

  return Tracker;
})(window, jQuery);

if (typeof module !== 'undefined') {
  module.exports = errorTracker;
}
