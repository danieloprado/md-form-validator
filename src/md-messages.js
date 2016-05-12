((angular, $) => {
  'use strict';

  angular.module('mdFormValidator')
    .directive('mdMessages', ['$compile', 'mdFormValidator', mdMessages]);

  function mdMessages($compile, provider) {

    return {
      restrict: 'E',
      require: '^^mdFormValidator',
      scope: false,
      priority: 1,
      replace: true,
      transclude: true,
      template: "<div><span></span></div>",
      compile: (tElement, tAttrs, transclude) => {
        const field = tAttrs.field ?
          $(tElement).parents('ng-form, [ng-form], .ng-form, form').eq(0).find(`[name="${tAttrs.field}"]`) :
          $(tElement).parent().find('input, select, textarea');

        return {
          pre: (scope, iElement) => {
            const fieldName = field.attr("name");

            tAttrs.$set('ng-messages', `${scope.formName}.${fieldName}.$error`);
            tAttrs.$set('ng-show', `
              (${scope.formName}.$submitted ||
              ${scope.formName}.${fieldName}.$touched) &&
              !${scope.formName}.${fieldName}.$valid`);
            tAttrs.$set('md-auto-hide', false);

            iElement.find('span').replaceWith(transclude(scope));
            iElement.removeAttr('md-messages');

            const defaultMessages = provider.getMessages();
            Object.keys(defaultMessages).forEach(key => {
              if ($(iElement).find(`[ng-message="${key}"]`).size() > 0) return;

              let errorMessage = defaultMessages[key];
              const attrs = field[0].attributes;
              Object.keys(attrs || {}).forEach(attr => {
                attr = attrs[attr].name;
                errorMessage = errorMessage.replace(new RegExp(`{${attr}}`, 'g'), field.attr(attr));
              });

              $(iElement).append(`<div ng-message="${key}">${errorMessage}</div>`);
            });

            $compile(iElement)(scope);
          }
        };

      }
    };
  }

})(angular, jQuery);
