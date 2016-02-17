(angular => {
  'use strict';

  angular.module('md.form.validator')
  .directive('mdMessages', ['$compile', mdMessages]);

  function mdMessages($compile) {

    let input_id = 0;

    return {
      restrict: 'E',
      require: '^^mdFormValidator',
      scope: false,
      priority: 1,
      replace: true,
      transclude: true,
      template: "<div><span></span></div>",
      compile: (tElement, tAttrs, transclude) => {

        const field = tAttrs.field || (() => {
          const $ = angular.element;
          const parent = $(tElement).parent();
          const input = parent.find('input')[0] || parent.find('select')[0];
          const name = $(input).attr('name') || "validator_field_" + (++input_id);
          $(input).attr("name", name);
          return name;
        })();

        tElement.removeAttr('md-messages');

        return {
          pre: (scope) => {

            tAttrs.$set('ng-messages', `${scope.formName}.${field}.$error`);
            tAttrs.$set('ng-show', `${scope.formName}.$submitted || ${scope.formName}.${field}.$touched`);
            tAttrs.$set('md-auto-hide', false);

            tElement.find('span').replaceWith(transclude(scope));

            $compile(tElement)(scope);
          }
        };

      }
    };
  }

})(angular);