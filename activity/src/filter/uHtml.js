/**
 * 输出富文本
 *
 * @example
 *  <div ng-bind-html="xxx | uHtml"></div>
 */
angular.module('ued').filter('uHtml', function ($sce) { //过滤器名称为uHtml
    return function (source) {
        return $sce.trustAsHtml(source)  //把html格式的字符串转成html格式显示
    }
})