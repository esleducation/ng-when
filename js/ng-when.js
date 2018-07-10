
/*
 * ng-when
 *
 * This angular module provide some usefull directives to execute code only then a certain condition is validated directly in your views
 *
 * @author 	Olivier Bossel <olivier.bossel@gmail.com>
 * @created 	19.06.14
 * @updated 	13.05.15
 * @version 	1.0.3
 */
(function() {
  var ngWhen;
  ngWhen = angular.module('ngWhen', []);

  /*
  	 * When directive that allows you to launch a scope function when the condition is true
   */
  return ngWhen.directive('ngWhen', [
    function() {
      var directive;
      return directive = {
        restrict: 'AM',
        controller: [
          '$scope', '$element', '$attrs', '$parse', '$timeout', function($scope, $element, $attrs, $parse, $timeout) {
            var controller;
            controller = {
              watcherRemover: void 0,

              /*
              							 * Remove the watcher on the element
               */
              removeWatcher: function() {
                if (this.watcherRemover === !void 0) {
                  this.watcherRemover();
                  return this.watcherRemover = void 0;
                }
              },

              /*
              							 * Watch the value to be notified when it's not null or undefined anymore
               */
              setupWatcher: function(value) {
                return this.watcherRemover = $scope.$watch(value, (function(_this) {
                  return function(newValue) {
                    if (newValue === void 0) {
                      return;
                    }
                    if (newValue === null) {
                      return;
                    }
                    _this.removeWatcher();
                    return _this.checkWhen(newValue);
                  };
                })(this), true);
              },

              /*
              							 * Check if the condition is validated
               */
              checkWhen: function(value) {
                var promise;
                if (value === null) {
                  return;
                }
                if (value.$promise) {
                  promise = value.$promise.then;
                } else {
                  promise = value.then;
                }
                if (typeof promise === 'function') {
                  return promise((function(_this) {
                    return function() {
                      return _this.executeCallbacks();
                    };
                  })(this));
                } else {
                  return this.executeCallbacks();
                }
              },

              /*
              							 * Init jquery plugin on element with options
               */
              _initjQueryPlugin: function($elm, plugin, options, timeout) {
                return $timeout(function() {
                  return $elm[plugin](options);
                }, timeout);
              },

              /*
              							 * Execute the callback when the condition is ok
               */
              executeCallbacks: function() {
                var doAttr, jqueryPlugin, jqueryPluginOptions, jqueryPluginOptionsAttr, options, plugin, plugins, scopeCallback, timeout, _i, _len, _results;
                doAttr = $attrs.ngWhenDo || $attrs.ngDo || $attrs["do"];
                scopeCallback = $parse(doAttr);
                timeout = $attrs.ngWhenDoTimeout || $attrs.ngDoTimeout || $attrs.doTimeout || 0;
                if (scopeCallback && doAttr) {
                  $timeout(function() {
                    return scopeCallback($scope, {
                      $elm: $element,
                      $attrs: $attrs
                    });
                  }, timeout);
                }
                jqueryPlugin = $attrs.ngWhenDoJqueryInit || $attrs.ngDoJqueryInit || $attrs.doJqueryInit;
                jqueryPluginOptionsAttr = $attrs.ngWhenDoJqueryOptions || $attrs.ngDoJqueryOptions || $attrs.doJqueryOptions;
                jqueryPluginOptions = $scope.$eval(jqueryPluginOptionsAttr) || {};
                if (jqueryPlugin) {
                  plugins = jqueryPlugin.split(',');
                  _results = [];
                  for (_i = 0, _len = plugins.length; _i < _len; _i++) {
                    plugin = plugins[_i];
                    if ($element[plugin] != null) {
                      if (plugins.length > 1) {
                        if (jqueryPluginOptions[plugin] != null) {
                          options = jqueryPluginOptions[plugin];
                        }
                      } else {
                        options = jqueryPluginOptions;
                      }
                      if ((options != null ? options.ngWhenTimeout : void 0) != null) {
                        timeout = options.ngWhenTimeout;
                      }
                      _results.push(this._initjQueryPlugin($element, plugin, options, timeout));
                    } else {
                      _results.push(void 0);
                    }
                  }
                  return _results;
                }
              }
            };
            return angular.extend(this, controller);
          }
        ],
        link: function(scope, elm, attrs, controller) {
          var value, whenAttr;
          whenAttr = attrs.ngWhen || attrs.when;
          value = whenAttr && scope.$eval(whenAttr);
          if (value === !void 0 && value === !null) {
            return controller.checkWhen(value);
          } else {
            controller.setupWatcher(whenAttr);
            return elm.bind('$destroy', controller.removeWatcher);
          }
        }
      };
    }
  ]);
})();
