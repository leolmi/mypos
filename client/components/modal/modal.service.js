'use strict';

angular.module('myposApp')
  .factory('Modal', ['$q','$rootScope','$modal',
    function ($q, $rootScope, $modal) {
      var base_TEMPLATE_DIR = 'app/modals/';
      /**
       * Opens a modal
       * @param  {Object} scope      - an object to be merged with modal's scope
       * @param  {String} modalClass - (optional) class(es) to be applied to the modal
       * @return {Object}            - the instance $modal.open() returns
       */
      function openModal(scope, modalClass) {
        $rootScope.$broadcast('SHOWING-MODAL');
        var modalScope = $rootScope.$new();
        scope = scope || {};
        scope.product = $rootScope.product;
        modalClass = modalClass || 'modal-default';

        angular.extend(modalScope, scope);

        $rootScope.modalActive = true;
        return $modal.open({
          templateUrl: 'components/modal/modal.html',
          windowClass: modalClass,
          scope: modalScope
        });
      }

      function resetModalState() {
        $rootScope.modalActive = false;
      }

      // Public API here
      return {
        types: {
          delete:'delete',
          yesnocancel:'yesnocancel',
          okcancel:'okcancel'
        },
        templates: {
          invite:'invite',
          accept:'accept',
          position:'position',
          marker: 'marker',
          map:'map',
          way:'way',
          route:'route'
        },
        show: function (options, type) {
          var self = this;
          type = type || 'ask';
          return $q(function (resolve, reject) {
            if ($rootScope.modalActive) return;
            var m = self.confirm[type](resolve, reject);
            m(options);
          });
        },

        /* Confirmation modals */
        confirm: {
          /**
           * Returns options for right ask modal form
           * @param type
           */
          getAskOptions: function (type) {
            var args = Array.prototype.slice.call(arguments),
              type = args.shift();
            var opt = {
              title: '',
              body: '',
              ok: 'OK',
              okClass: 'btn-warning',
              okResult: 'ok',
              cancel: 'Cancel',
              cancelClass: 'btn-default',
              no: '',
              noClass: 'btn-danger',
              noResult: 'no',
              modalClass: 'modal-warning'
            };
            switch (type) {
              case('delete'):
                var action = args[1] ? args[1] : 'Delete';
                opt.title = 'Confirm ' + action;
                opt.body = '<p>Confirm ' + action + ' <strong>' + args[0] + '</strong> ?</p>';
                opt.ok = action;
                opt.okClass = 'btn-danger';
                opt.modalClass = 'modal-danger';
                break;
              case('yesnocancel'):
                opt.ok = 'Yes';
                opt.no = 'No';
                break;
              case ('okcancel'):
                opt.ok = 'OK';
                break;
            }
            return opt;
          },


          /**
           * Create a function to open a generic confirmation modal (ex. ng-click='myModalFn(options, arg1, arg2...)')
           * @param  {Function} exc - callback, ran when execution is confirmed
           * @param  {Function} [dsc] - callback, ran when execution is discard
           * @return {Function}     - the function to open the modal (ex. myModalFn)
           */
          ask: function (exc, dsc) {
            exc = exc || angular.noop;
            dsc = dsc || angular.noop;

            /**
             * Open a execution confirmation modal
             * @param  options   - class of modal options
             * @param  {All}     - any additional args are passed staight to del callback
             */
            return function () {
              var args = Array.prototype.slice.call(arguments),
                options = args.shift(),
                execModal;

              var buttons = [];
              if (options.ok) buttons.push({
                classes: options.okClass,
                text: options.ok,
                click: function (e) {
                  args.push(options.okResult);
                  execModal.close(e);
                }
              });
              if (options.no) buttons.push({
                classes: options.noClass,
                text: options.no,
                click: function (e) {
                  args.push(options.noResult);
                  execModal.close(e);
                }
              });
              if (options.cancel) buttons.push({
                classes: options.cancelClass,
                text: options.cancel,
                click: function (e) {
                  execModal.dismiss(e);
                }
              });

              execModal = openModal({
                modal: {
                  dismissable: true,
                  title: options.title,
                  html: options.body,
                  buttons: buttons,
                  show: {header: true, footer: true}
                }
              }, options.modalClass);

              execModal.result.then(function (event) {
                exc.apply(event, args);
                resetModalState();
              }, function (event) {
                dsc.apply(event, args);
                resetModalState();
              });
            };
          },


          /**
           * Popup
           * @param  {Function} [exc] - callback, ran when execution is confirmed
           * @param  {Function} [dsc] - callback, ran when execution is discard
           * @returns {Function}
           */
          popup: function (exc, dsc) {
            exc = exc || angular.noop;
            dsc = dsc || angular.noop;


            /**
             * l'argomento principale è strutturato così:
             * args[0] => opt:
             *    opt.ok = { text:'OK' }
             *    opt.cancel = { text:'Annulla' }
             *    opt.title
             *    opt.template
             *    opt.show.header = true/false
             *    opt.show.footer = true/false
             */
            return function () {
              var args = Array.prototype.slice.call(arguments),
                popupModal;
              var show = args[0].show || {header: true, footer: true};
              var buttons = [];

              if (args[0].buttons) {
                args[0].buttons.forEach(function (b) {
                  buttons.push({
                    classes: b.style || 'btn-warning',
                    text: b.caption,
                    click: function (e) {
                      if (b.action)
                        b.action();
                      if (b.close)
                        popupModal.close(e);
                    }
                  });
                });
              }
              if (args[0].ok) {
                buttons.push({
                  classes: 'btn-success',
                  text: args[0].ok.text || 'Ok',
                  click: function (e) {
                    popupModal.close(e);
                  }
                });
              }
              if (args[0].cancel) {
                buttons.push({
                  classes: 'btn-warning',
                  text: args[0].cancel.text || 'Cancel',
                  click: function (e) {
                    popupModal.dismiss(e);
                  }
                });
              }

              popupModal = openModal({
                modal: {
                  context: args[0],
                  dismissable: true,
                  idle: false,
                  title: args[0].title,
                  template: base_TEMPLATE_DIR + args[0].template + '.html',
                  buttons: buttons,
                  show: show
                },
                close: function (e) {
                  popupModal.close(e);
                },
                cancel: function (e) {
                  popupModal.dismiss(e);
                }
              }, 'modal-popup');

              popupModal.result.then(function (event) {
                exc.apply(event, args);
                resetModalState();
              }, function () {
                dsc.apply(event, args);
                resetModalState();
              });
            };
          }
        }
      };
    }]);
