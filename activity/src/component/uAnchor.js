/**
 * 处理 <a> 的 href 属性，让跳转不受 <base> 影响
 * 如果 href 为 空、#、javascript: 开头，点击会阻止
 *
 * 如果不需要处理 或者 遇到严重 BUG，删除本文件，使用 JS 跳转: ued.href() ued.replace()
 */
angular.module('ued').directive('a', function () { //directive自定义指令 指令名称为a
    return {
        restrict: 'E', //取值有三种     A：用于元素Attribute   E:用于元素的名称        C：用于css中的class
        link: function (scope, element, attrs) { //link函数可以用于绑定一些事件
            $(element).on('click', function (event) {
                var href = $.trim($(this).attr('href')) //$.trim去除字符串两端空白字符 获取目标a元素的href值
                var target = $.trim($(this).attr('target')) //获取目标a元素的href值
                if (href === '' || href === '#' || href.indexOf('javascript:') === 0) {
                    return false
                }
                href = ued.path(href)
                switch (target) {
                    case '_blank':
                        window.open(href) 
                        break
                    case '_parent':
                        window.parent.open(href) 
                        break
                    case '_top':
                        window.top.open(href) 
                        break
                    default:
                        var iframe = $('iframe[name="' + target + '"]')
                        if (target !== '_self' && iframe.length) {
                            iframe.attr('src', href)
                        } else {
                            ued.href(href)
                        }
                }
                return false
            })
        }
    }
})