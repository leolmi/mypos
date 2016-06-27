'use strict';

angular.module('myposApp')
  .factory('Logger',['toastr', function(toastr){
    function getToastrSettings(){
      return {
        allowHtml: true,
        closeButton: false,
        closeHtml: '<button>&times;</button>',
        containerId: 'toast-container',
        extendedTimeOut: 1000,
        iconClasses: {
          error: 'toast-error',
          info: 'toast-info',
          success: 'toast-success',
          warning: 'toast-warning'
        },
        messageClass: 'toast-message',
        preventDuplicates: true,
        positionClass: 'toast-bottom-right',
        tapToDismiss: true,
        timeOut: 5000,
        titleClass: 'toast-title',
        toastClass: 'toast'
      }
    }

    function validateMessage(err) {
      if (_.isObject(err)) {
        if (err.message || err.data)
          return err.message || err.data;
        return JSON.stringify(err);
      }
      return err;
    }

    var toastOk = function(title, message){
      toastr.success(validateMessage(message), title, getToastrSettings());
    };

    var toastError = function(title, message){
      toastr.error(validateMessage(message), title, getToastrSettings());
    };

    var toastInfo = function(title, message){
      toastr.info(validateMessage(message), title, getToastrSettings());
    };

    var toastWarning = function(title, message){
      toastr.warning(validateMessage(message), title, getToastrSettings());
    };


    var _monitor;
    function showmonitor() {
      var toast = $(_monitor.el[0]);
      if (toast && !toast.hasClass('toast-monitor'))
        toast.addClass('toast-monitor');
    }
    function hiddenmonitor() {
      _monitor = undefined;
    }

    var monitor = function(title, message) {
      if (_monitor) {
        if (title) _monitor.el.find('.toast-title')[0].innerText = title;
        if (message) _monitor.el.find('.toast-message')[0].innerText = message;
      }
      else {
        var s = getToastrSettings();
        s.timeOut = 60000;
        s.closeButton = true;
        s.tapToDismiss = false;
        s.onShown = showmonitor;
        s.onHidden = hiddenmonitor;
        _monitor = toastr.info(validateMessage(message), title, s);
      }
    };

    return {
      ok: toastOk,
      error: toastError,
      info: toastInfo,
      warning: toastWarning,
      monitor: monitor
    }
  }]);
