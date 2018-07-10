###
# ng-when
#
# This angular module provide some usefull directives to execute code only then a certain condition is validated directly in your views
#
# @author 	Olivier Bossel <olivier.bossel@gmail.com>
# @created 	19.06.14
# @updated 	13.05.15
# @version 	1.0.3
###
do ->

	ngWhen = angular.module 'ngWhen', []

	###
	# When directive that allows you to launch a scope function when the condition is true
	###
	ngWhen.directive 'ngWhen', [

		(

		) ->

			# return the directive
			directive =
				restrict : 'AM'
				controller : [
						'$scope'
						'$element'
						'$attrs'
						'$parse'
						'$timeout'
					(
						$scope
						$element
						$attrs
						$parse
						$timeout
					) ->

						controller =

							watcherRemover : undefined

							###
							# Remove the watcher on the element
							###
							removeWatcher : ->
								if @watcherRemover is not undefined
									@watcherRemover()
									@watcherRemover = undefined

							###
							# Watch the value to be notified when it's not null or undefined anymore
							###
							setupWatcher : (value) ->
								@watcherRemover = $scope.$watch value, (newValue) =>
									return if newValue is undefined
									return if newValue is null
									@removeWatcher()
									@checkWhen newValue
								, true

							###
							# Check if the condition is validated
							###
							checkWhen : (value) ->
								return if value is null
								if value.$promise then promise = value.$promise.then
								else promise = value.then
								if typeof promise is 'function'
									promise =>
										@executeCallbacks()
								else @executeCallbacks()

							###
							# Init jquery plugin on element with options
							###
							_initjQueryPlugin : ($elm, plugin, options, timeout) ->
								$timeout ->
									$elm[plugin](options)
								, timeout

							###
							# Execute the callback when the condition is ok
							###
							executeCallbacks : ->

								# get the function to call in scope :
								doAttr = $attrs.ngWhenDo || $attrs.ngDo || $attrs.do
								scopeCallback = $parse doAttr
								timeout = $attrs.ngWhenDoTimeout || $attrs.ngDoTimeout || $attrs.doTimeout || 0

								# call function in scope :
								if scopeCallback and doAttr
									$timeout ->
										scopeCallback $scope, 
											$elm : $element
											$attrs : $attrs
									, timeout

								# get the jquery plugin name
								jqueryPlugin = $attrs.ngWhenDoJqueryInit || $attrs.ngDoJqueryInit  || $attrs.doJqueryInit

								# try to grab the options
								jqueryPluginOptionsAttr = $attrs.ngWhenDoJqueryOptions  || $attrs.ngDoJqueryOptions || $attrs.doJqueryOptions
								jqueryPluginOptions = $scope.$eval(jqueryPluginOptionsAttr) or {}

								# if is a jquery init
								if jqueryPlugin

									# check if we have multiple plugins
									plugins = jqueryPlugin.split ','

									# loop on each plugins
									for plugin in plugins

										if $element[plugin]?

											# if we have multiple plugins, try to get the options for this plugin in the json
											if plugins.length > 1
												options = jqueryPluginOptions[plugin] if jqueryPluginOptions[plugin]?
											else
												# we have only 1 plugin to the options are the jqueryPluginOptions itself
												options = jqueryPluginOptions
										
											# timeout
											timeout = options.ngWhenTimeout if options?.ngWhenTimeout?

											# init plugin
											@_initjQueryPlugin $element, plugin, options, timeout
						
						# extend this with controller object
						angular.extend @, controller

				]
				link : (scope, elm, attrs, controller) ->
					whenAttr = attrs.ngWhen || attrs.when
					value = whenAttr && scope.$eval whenAttr
					if value is not undefined and value is not null
						controller.checkWhen value
					else
						controller.setupWatcher whenAttr
						elm.bind '$destroy', controller.removeWatcher


	]