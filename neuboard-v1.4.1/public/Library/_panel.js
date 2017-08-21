angular.module('panels', [])
/**
 * @widgetToggle - Directive to toggle widget
 */
.directive('widgetToggle', function () {
  return {
    restrict: 'A',
    link: function (scope, element) {
      element.click(function () {
        $(this).parent().parent().next().slideToggle("fast"), $(this).toggleClass("fa-chevron-down fa-chevron-up")
      });
    }
  }
})

/**
 * @widgetClose - Directive to close widget
 */
.directive('widgetClose', function () {
  return {
    restrict: 'A',
    link: function (scope, element) {
      element.click(function () {
        var panel = $(this).parent().parent().parent();
        panel.fadeOut(1000, function () { panel.parent().remove(); });
      });
    }
  }
})

/**
 * @fullscreenWidget - Directive for fullscreen widgets
 */
.directive('fullscreenWidget', function fullscreenWidget() {
  return {
    restrict: 'A',
    link: function (scope, element) {
      element.click(function () {
        var panel = $(this).closest('.panel');
        panel.toggleClass('widget-fullscreen');
        $(this).toggleClass('fa-expand fa-compress');
        $('body').toggleClass('fullscreen-widget-active')

      });
    }
  }
});