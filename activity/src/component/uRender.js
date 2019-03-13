/**
 * 拿到标签渲染完的回调
 *
 * @example
 *  <div u-render="onRender()"></div>
 */
angular.module('ued').directive('uRender', function ($timeout) { //定义一个名为uRender的指令
    return {
        restrict: 'A', //attribute属性  用在元素的属性上
        link: function (scope, element, attrs) { //link函数用于绑定一些事件 和数据
            scope.$watch(function () {            //绑定监听事件
                scope.$eval(attrs.ngBindHtml)
            }, function (value) {
                $timeout(function () {
                    scope.$eval(attrs.uRender, {$element: element})
                })
            })
        }
    }
})