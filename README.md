# ng-when (1.0.3)

Angular module that provide directive to execute code when a condition is validated directly from your views. It provide also a quick and cool solution to init jquery plugins only when all the needed datas are in your views


## Get Started

First, you need to include the scripts and css in your page

```html
<script src="angular.js"></script>
<script src="ng-when.js"></script>
```

Then you have to specify the "ngWhen" module as dependency of your angular app

```javascript
var myApp = angular.module('myAwesomeApp', ['ngWhen']);
```

Finaly you can use the ng-when directive in your views

```html
<!-- simple usage -->
<button ng-when="myCondition" ng-do="doSomething()">my cool button</button>

<!-- in case you have a list of hotels and you want a tooltip (with tooltipster jquery plugin) -->
<!-- the tooltipster read the title attribute so you need to be sure it's been populated before init the plugin -->
<button ng-when="hotel.tooltip"
    do-jquery-init="tooltipster"
    do-jquery-options="myOptionsObjectInController"
    title="{{ hotel.tooltip }}">
    My cool button        
</button>
```

> See the index.html file for full sample


## Directives

* __ng-when__                   : REQUIRED : Store your condition
* __ng-when-do__                : Store what to do when the condition is validated  
    * __ng-do__                       : Alias to ng-when-do
    * __do__                          : Alias to ng-when-do
* __ng-when-do-jquery-init__    : Store the name(s) (comma separated) of the jquery plugin that you want to init
    * __ng-do-jquery-init__            : Alias to ng-when-do-jquery-init
    * __do-jquery-init__               : Alias to ng-when-do-jquery-init
* __ng-when-do-jquery-options__ : Store the options to pass to the jquery plugin on init.
    * __ng-do-jquery-options__         : Alias to ng-when-do-jquery-options
    * __do-jquery-options__            : Alias to ng-when-do-jquery-options
* __ng-when-do-timeout__        : A timeout in ms to wait before executing the callback
    * __ng-do-timeout__                 : Alias to ng-when-do-timeout
    * __do-timeout__                    : Alias to ng-when-do-timeout

> If multiple jquery plugins are specified (comma separated), each plugin options need to be scoped in the options object with the plugin name as property name


## Thanks

This module is inspired by the module <a target="_blank" href="https://github.com/Pasvaz/bindonce">bindonce</a> written by Pasquale Vazzana (thanks to him)