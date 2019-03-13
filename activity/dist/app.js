;(function() {
/* ========== main.js ========== */

/*
 |--------------------------------------------------------------------------
 | 设置本地模拟接口的目录
 |--------------------------------------------------------------------------
 | 如果不需要模拟 则删除此行
 |
 |
 */

ued.ajax.mock('mock')

/*
 |--------------------------------------------------------------------------
 | 解决移动端 click 300ms 延迟
 |--------------------------------------------------------------------------
 | 如果页面比较特殊会出现 BUG 则删除此行
 |
 |
 */

ued.fastclick()

/*
 |--------------------------------------------------------------------------
 | 微信 JSSDK 配置
 |--------------------------------------------------------------------------
 | 上线后，如果是 umaman.com 结尾的域名，这里不用改动
 | 如果是外部接口或者有特殊需求，请查看文档 /frontend/public/ued.js/doc/api.html
 |
 */

//ued.weixin.uma()

/*
 |--------------------------------------------------------------------------
 | 隐藏微信右上角分享按钮
 |--------------------------------------------------------------------------
 | 如果不需要隐藏，则删除此行
 | 如果想刚开始隐藏，等待 JSSDK 加载成功后才显示，也可以保留这行代码，不用删
 |
 */

//wx.ready(function () {
//  wx.hideOptionMenu()
//})

/*
 |--------------------------------------------------------------------------
 | 设置微信分享
 |--------------------------------------------------------------------------
 | 会在 config 成功后自动触发
 | 可以多次设置，会覆盖前面的设置
 |
 */

// ued.weixin.share({
//     title: '',
//     desc: '',
//     link: '',
//     imgUrl: ''
// })

/*
 |--------------------------------------------------------------------------
 | 百度统计
 |--------------------------------------------------------------------------
 | ued.baidu.track('百度统计代码问号后面那一串内容')，多个可以用数组
 |
 |
 */

// ued.baidu.track('???')

/*
 |--------------------------------------------------------------------------
 | ICC 统计
 |--------------------------------------------------------------------------
 | ued.track('填 openid')
 | 如果这个时候还拿不到openid 就在拿到之后再调用一次 ued.track() 和 ued.trackPage()
 |
 */

// ued.track('???')
//ued.trackPage()

/*
 |--------------------------------------------------------------------------
 | 定义 angular 模块
 |--------------------------------------------------------------------------
 | run 里可以注入 service 执行一些初始化逻辑
 | 如果不涉及 service 的调用，可以直接写在 run 外面
 |
 */

angular.module('ued', []).run(function (WebApi) {
	getWeiXin();
	function getWeiXin(){
		WebApi.getWeiXin().always(function(){					
		}).then(function(res){
			console.info(res)
			configWeixin(res)
			
		},function(res){
			console.info(res)
		})
	}

	function configWeixin(weixin){
		wx.config({
			appId: weixin.appId, // 必填，公众号的唯一标识
			timestamp: weixin.timestamp, // 必填，生成签名的时间戳
			nonceStr: weixin.nonceStr, // 必填，生成签名的随机串
			signature: weixin.signature,// 必填，签名，见附录1
			jsApiList: [ // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				'onMenuShareTimeline',//这里不知道你用的地理接口是哪个就两个都写上了
				'onMenuShareAppMessage',
				'startRecord',
				'stopRecord',
				'onVoiceRecordEnd',
				'playVoice',				
				'stopVoice',
				'uploadVoice',
				'onVoicePlayEnd',
				'hideMenuItems',
				'hideOptionMenu'
			]
		});
	}
})

/*
 |--------------------------------------------------------------------------
 | 加载主题
 |--------------------------------------------------------------------------
 | 主题名：通常是从接口获取、或者从 cookie 获取
 | 是否插入模式：如果是从异步接口获取的数据再加载主题，需要设置为 true
 |
 */

loadTheme('default')

function loadTheme (theme, append) {
    if (theme && theme != 'default') {
        var version = $('html').data('version')
        var css = 'dist/theme-' + theme + '.css?' + version
        var js = 'dist/theme-' + theme + '.js?' + version
        if (append) {
            Promise.all([ued.loadStyle(css), ued.loadScript(js)]).then(bootstrap)
            return
        }
        document.write('<link rel="stylesheet" href="' + css + '">')
        document.write('<script src="' + js + '"></script>')
    }
    bootstrap()
}

function bootstrap () {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['ued'])   //angular.bootstarp只会绑定第一次加载的对象   后面重复绑定或者其他对象绑定 都会在控制台输出错误
//      angular.bootstrap(element,['module'],['config']); //手动加载angularjs的模板   参数1：绑定的ng-app的dom元素  参数2：绑定的模块  参数3：附加的配置
    })
}


})();

;(function() {
/* ========== component/uAnchor.js ========== */

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

})();

;(function() {
/* ========== component/uRender.js ========== */

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

})();

;(function() {
/* ========== filter/uHtml.js ========== */

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

})();

;(function() {
/* ========== page/index.js ========== */

angular.module('ued').directive('pageIndex', function (WebApi) {
    return {
        templateUrl: 'page/index.html',
        restrict: 'E',
        link: function (scope) {

//         var Authorization = null;
//          _bridge.callHandler("Authorization", null, function(response) {
//				Authorization = response;
//			})
			scope.activityId = ued.query('activity_id');
            scope.isOver = true;

			function setupWebViewJavascriptBridge(callback) {
		        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
		        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
		        window.WVJBCallbacks = [callback];
		        var WVJBIframe = document.createElement('iframe');
		        WVJBIframe.style.display = 'none';
		        WVJBIframe.src = 'https://__bridge_loaded__';
		        document.documentElement.appendChild(WVJBIframe);
		        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
		    }

		    setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('Authorization', {'foo': 'bar'}, function(response) {
					scope.Authorization = response;
					getPage(scope.activityId,scope.Authorization)
				})
			})


			function getPage(activityId,Authorization){
				WebApi.getActivity(activityId,{},Authorization).always(function(){
				}).then(function(res){
	                scope.infoData = res.data
	                ued.title(res.data.name)
	                var transfromDate = scope.infoData.end_time.replace(/-/g, "/");
	                scope.countDown = setInterval(function(){leftTimer(String(transfromDate))},1000);

				},function(res){

	            })
			}



			scope.singUp = function(){
				if(scope.isOver){
					weui.alert('?????')
					return
				}
				WebApi.singUp(scope.activityId,{},scope.Authorization).always(function(){
				}).then(function(res){
                    if(res.status == 200){
                        weui.alert(res.msg)
                    }else {
                        weui.alert(res[1])
                    }

				},function(res){
					console.info(res)
	            })
			}


            function leftTimer(targetTime){
                var leftTime = (new Date(targetTime).getTime()) - (new Date().getTime());
                if(!leftTime || leftTime <= 0){
                    scope.isOver = true;
                    scope.$apply();
                    clearInterval(scope.countDown)
                    return;
                }
                scope.isOver = false;
                scope.days = parseInt(leftTime / 1000 / 60 / 60 / 24 , 10);
                scope.hours = parseInt(leftTime / 1000 / 60 / 60 % 24 , 10);
                scope.minutes = parseInt(leftTime / 1000 / 60 % 60, 10);
                scope.seconds = parseInt(leftTime / 1000 % 60, 10);
                scope.days = checkTime(scope.days);
                scope.hours = checkTime(scope.hours);
                scope.minutes = checkTime(scope.minutes);
                scope.seconds = checkTime(scope.seconds);
                scope.$apply()
            }
            function checkTime(i){ //?0-9???????0??1??01
                if(i<10)
                {
                    i = "0" + i;
                }
                return i;
            }

			// ued.ajax({
            //     url: 'http://api.box-fairy.com/student/test',
            //     type: 'GET',
            //     dataType: 'json',
            //     headers: {
            //         Authorization: Authorization
            //     },
            //     beforeSend: function (XMLHttpRequest) {
            //         XMLHttpRequest.setRequestHeader("Authorization",Authorization);
            //     },
            //     success: function(res){
            //             console.info(res)
            //     },
            //     error: function(res){

            //     }
            // })



            function showLoading () {
                loading = weui.loading('加载中...')
            }

            function hideLoading () {
                loading && loading.hide()
            }
       }
    }
})

})();

;(function() {
/* ========== page/introduce.js ========== */

angular.module('ued').directive('pageIntroduce', function (WebApi) {
    return {
        templateUrl: 'page/introduce.html',
        restrict: 'E',
        link: function (scope) {

			ued.title('转介绍')
			
			function setupWebViewJavascriptBridge(callback) {
		        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
		        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
		        window.WVJBCallbacks = [callback];
		        var WVJBIframe = document.createElement('iframe');
		        WVJBIframe.style.display = 'none';
		        WVJBIframe.src = 'https://__bridge_loaded__';
		        document.documentElement.appendChild(WVJBIframe);
		        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
		    }
		
		    setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('Authorization', {'foo': 'bar'}, function(response) {
					scope.Authorization = response;					
				})
			})
			
			scope.send = function(){
				if(!(/(?:^1[3456789]|^9[28])\d{9}$/.test($('.phone').val()))){
					weui.alert('请填写正确的手机号！')
					return;
				}
				if(!$('.name').val() || !$.trim($('.name').val())){
					weui.alert('请填称呼！')
					return;
				}
	
				sendMsg($('.phone').val(),$('.name').val(),$('.info').val(),scope.Authorization);
			}
			
			function sendMsg(phone,name,description,Authorization){
				WebApi.introduce({phone: phone,name: name,description: description},Authorization).always(function(){
				}).then(function(res){
					if(res.status == 200){
						weui.alert(res.msg)
					}
	               
				},function(res){
					
	            })
			}
			
			
            function showLoading () {
                loading = weui.loading('加载中...')
            }

            function hideLoading () {
                loading && loading.hide()
            }
       }
    }
})

})();

;(function() {
/* ========== page/plp.js ========== */

angular.module('ued').directive('pagePlp', function (WebApi) {
    return {
        templateUrl: 'page/plp.html',
        restrict: 'E',
        link: function (scope) {

			
//			scope.Authorization = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk0NmVkMWE0NjIxMWE3OTUyOTBkYzI4ZGJkZTA2ZDUyZjQ4NTllOWY0ZDk3Mjk3MTdjMzIxZDNkZDBlZDM2ZWU4Nzc2OWMzYWQyNzA2Mzk3In0.eyJhdWQiOiIyIiwianRpIjoiOTQ2ZWQxYTQ2MjExYTc5NTI5MGRjMjhkYmRlMDZkNTJmNDg1OWU5ZjRkOTcyOTcxN2MzMjFkM2RkMGVkMzZlZTg3NzY5YzNhZDI3MDYzOTciLCJpYXQiOjE1NDQ0MzYzNTEsIm5iZiI6MTU0NDQzNjM1MSwiZXhwIjoxNTc1OTcyMzUxLCJzdWIiOiIzNjk4Iiwic2NvcGVzIjpbIioiXX0.KjYVJkGaDCVSdKLEEJGzmDg0Lm2Qtg00ZRRNR378XfLPOvmU8VoPH6TzPOL2UD2K_q3F5hztJ1lXH_TbuJnaD08Fi126us47FKGSoahKWV_NmCdbp8FoBQtIF1BehhUbFrzlj94HmAKEhLj7FBHvLJLsxj7dYayUxyBxQkNlJeHCa_WOEkHxIDDvROV0otuuz6qU9_QUm1TbBtFVjeUcORERteZu7kMPSjkbl1qt_AVDQFieveVYoDZtTOT608heUXYPQcQvSnV5AdNezrdezHVOH3ofK9OpLFZM8G0KkyPPR-1laij5In2RtRflwgRE4fWTPwlBkBz17PuepB7ILNj54e2kscmos7v3HAfcmOY3IsGM4Gcef86OktlXlIvxhBDiTBAz18RuVS-w6cQu4TkDMezmWJ7Y3Nct1zKe9S4apY8B1s_fuVbXMh5iWk_uvN158Jcnww6eqxaRdtzDECQczG7BNa2yJIa8we1wVvfHFc-QsSwt_4D9tvGjgUXRsDQ-nHxXQzDFUOqgVg1-V3Ytc0zR9p_ICepjIiEqQz_l4XIeJaTo_OmEWOIEaJWEiAmpaQeKmNfagGgBsV4Odb_IOZ94YXxRSBWkVj89Atb1YjcIsr2QjhQjD7jCPSTd6V7rhzuXqe-_ctCCS9vzQAJW7I0nYVCDW1aIsS9jxeM';
//			
			
			function setupWebViewJavascriptBridge(callback) {
		        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
		        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
		        window.WVJBCallbacks = [callback];
		        var WVJBIframe = document.createElement('iframe');
		        WVJBIframe.style.display = 'none';
		        WVJBIframe.src = 'https://__bridge_loaded__';
		        document.documentElement.appendChild(WVJBIframe);
		        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
		    }
		
		    setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('Authorization', {'foo': 'bar'}, function(response) {
					scope.Authorization = response;
					getPage(scope.Authorization)
				})
			})
		
            
            function getPage(Authorization){
            		WebApi.getInfo({},Authorization).always(function(){
				}).then(function(res){
	                
					scope.infoData = res.data;
					scope.testId = res.data.id;
					scope.infoData && scope.infoData.details.map( item => {
						item.checkedId = null;
					})
	
				},function(res){
					console.info(res)
				})
            }
			
			

			scope.checkNum = 0;
			scope.clickItem = function(id,item){
				item.checkedId = id
				scope.checkNum = 0;
				scope.infoData.details.map( item => {
					if(item.checkedId){
						scope.checkNum ++
					}
				})
			}

			scope.submit = function(){
				
				if(scope.checkNum < scope.infoData.details.length){
					weui.alert('请填写完成再提交哦！')
					return
				}
				scope.formValue = [];
				scope.infoData.details.map( item => {
					var list = {}
					list.question_id = item.question.question_id
					list.answer_id = item.checkedId
					scope.formValue.push(list)
				})
				scope.formData = {}
				scope.formData.data = JSON.stringify(scope.formValue);
				uploadTest(scope.testId,scope.formData,scope.Authorization)
			}



			function uploadTest(id,formdata,Authorization){
				$.ajax({
					url: 'http://api.box-fairy.com/student/test/'+id+'/submit',
					type: 'post',
					data: formdata,
					dataType: 'json',
					beforeSend: function (XMLHttpRequest) {
						XMLHttpRequest.setRequestHeader("Authorization",Authorization);
					},
					success: function(res){
						weui.alert(res.msg,function(){
							ued.reload();
						});

					},
					error: function(res){
						weui.alert(res.msg);
					}
				})
			}






            function showLoading () {
                loading = weui.loading('加载中...')
            }

            function hideLoading () {
                loading && loading.hide()
            }
       }
    }
})

})();

;(function() {
/* ========== service/WebApi.js ========== */



angular.module('ued').service('WebApi', function () {
    /**
     * 示例，应该删除
     */
//  this.test = function () {
//      return ued.get('/hello').then(function (res) {
//          // 可以先做一些数据处理等操作 再返回想要的内容，
//          // 下一次 then 就是这里 return 的值
//          var result = res.result
//          result.abcd = 1234
//          return result
//      })
//  }
//
//  this.abc = function () {
//      return ued.post('/abc', {d: 'e'})
//  }


    //获取微信
    this.getWeiXin = function (data) {
    		return ued.get('https://weixin.bbpapp.com/lesson/weixin/getwxjsconfig',data)
    }
    //获取UserId
    this.getUserId = function(data){
    		return ued.get('https://freelesson.bbpapp.com/freelesson/getuserid',data)
    }
    this.getInfo = function (data,Authorization) {
    		return ued.get('http://api.box-fairy.com/student/test',data,{beforeSend:function (XMLHttpRequest) {
         	XMLHttpRequest.setRequestHeader("Authorization", Authorization);
       }})
    }

    this.uploadTest = function (id,data,Authorization) {
        return ued.post('http://api.box-fairy.com/student/test/'+id+'/submit',data,{beforeSend:function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Authorization", Authorization);
        }})
    }


    this.getActivity = function (id,data,Authorization) {
        return ued.get('http://api.box-fairy.com/activity/'+id+'',data,{beforeSend:function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Authorization", Authorization);
        }})
    }

    this.singUp = function (id,data,Authorization) {
        return ued.post('http://api.box-fairy.com/student/activity/'+id+'/signup',data,{beforeSend:function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Authorization", Authorization);
        }})
    }

    this.introduce = function (data,Authorization) {
        return ued.post('http://api.box-fairy.com/student/recommend',data,{beforeSend:function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Authorization", Authorization);
        }})
    }



})


})();

;(function() {
/* ========== service/uCommon.js ========== */

angular.module('ued').service('uCommon', function (WebApi) {
	var uCommon = {}
	
	//判断授权
	uCommon.getUsercookie = function(){
		if(!ued.cookie.get('Weixin_userInfo')){
			var enlink = window.location.origin+'/toutiao/index.html';
			ued.href(window.location.origin+'/headlines/auth/weixinauth?callbackUrl='+enlink+'');
			return false;
		}
		return true;
	}
	
	
	
	

	return uCommon
})

})();

;(function() {
/* ========== templates.js ========== */

angular.module('ued').run(['$templateCache', function($templateCache) {$templateCache.put('page/index.html','\n<div class="head">\n\t<div class="head-left">\n\t\t<img src="{{infoData.tenant.avatar}}" width="80" height="69" alt="" />\n\t\t<span>{{infoData.tenant.name}}</span>\n\t</div>\n\t<div class="head-right">\n\t\t<p>\u53D1\u5E03\u65E5\u671F\uFF1A<span>{{infoData.created_at.split(\' \')[0]}}</span></p>\n\t</div>\n</div>\n\n<div class="banner">\n\t<img src="" ng-src="{{infoData.image}}" alt="" />\n</div>\n\n<div class="title">\n\t<p>{{infoData.name}}</p>\n</div>\n\n<div class="info">\n\t<div class="info-item">\n\t\t<div class="icon-box">\n\t\t\t<img src="static/icon-1.png" alt="" />\n\t\t</div>\n\t\t<div class="info-text">\n\t\t\t<p>{{infoData.start_time}}</p>\n\t\t</div>\n\t</div>\n\t<div class="info-item">\n\t\t<div class="icon-box">\n\t\t\t<img src="static/icon-2.png" alt="" />\n\t\t</div>\n\t\t<div class="info-text">\n\t\t\t<p>{{infoData.address}}</p>\n\t\t</div>\n\t</div>\n\t<div class="info-item">\n\t\t<div class="icon-box">\n\t\t\t<img src="static/icon-3.png" alt="" />\n\t\t</div>\n\t\t<div class="info-text">\n\t\t\t<p>\u5DF2\u62A5\u540D{{infoData.join}}\u4EBA / <span ng-if="infoData.number != 0">\u9650{{infoData.number}}\u4EBA\u62A5\u540D</span><span ng-if="infoData.number == 0">\u4E0D\u9650\u4EBA\u6570</span></p>\n\t\t</div>\n\t</div>\n\t<div class="info-item">\n\t\t<div class="icon-box">\n\t\t\t<img src="static/icon-4.png" alt="" />\n\t\t</div>\n\t\t<div class="info-text">\n\t\t\t<p class="price" ng-if="infoData.amount != 0">{{infoData.amount}} \u5143</p>\n\t\t\t<p class="price" ng-if="infoData.amount == 0">\u514D\u8D39</p>\n\t\t</div>\n\t</div>\n</div>\n\n<div class="content">\n\t<div class="content-head">\n\t\t<p class="content-title">\u6D3B\u52A8\u8BE6\u60C5</p>\n\t\t<img class="content-icon" src="static/icon-5.png">\n\t\t<p class="content-text">\n\t\t\t<span></span>\n\t\t\t\u6D3B\u52A8\u5185\u5BB9\n\t\t</p>\n\t</div>\n\t<div class="content-main">\n\t\t<p class="content-center">{{infoData.discription}}</p>\n\t</div>\n</div>\n\n<div class="content">\n\t<div class="content-head content-border">\n\t\t<p class="content-text">\n\t\t\t<span></span>\n\t\t\t\u6D3B\u52A8\u4ECB\u7ECD\n\t\t</p>\n\t\t<!--<p class="main-title">\u6D3B\u52A8\u5206\u4E3A\u4E24\u573A\uFF0C\u672C\u573A\u65F6\u95F4\u4E3A12\u670820\u65E5 10:3-11:30 </p>\n\t\t<p class="main-title">\u6D3B\u52A8\u5730\u70B9\uFF1A\u4E39\u51E4\u8DEF \u6D88\u9632\u5927\u961F\u4E91\u9633\u4E2D\u961F</p>-->\n\t</div>\n\t<div class="content-main" ng-bind-html="infoData.content | uHtml">\n\n\t</div>\n</div>\n\n<div class="bottom">\n\t<div class="btm-left">\n\t\t<p ng-show="!isOver">\u8DDD\u7ED3\u675F\uFF1A<span>{{days}}\u5929{{hours}}\u5C0F\u65F6{{minutes}}\u5206\u949F</span></p>\n\t\t<p ng-show="isOver">\u5DF2\u7ED3\u675F</p>\n\t</div>\n\t<div class="btm-right" ng-class="{\'is-disable\': isOver}" ng-click="singUp()">\n\t\t\u62A5\u540D\n\t</div>\n</div>');
$templateCache.put('page/introduce.html','\n<div class="box">\n\t<div class="content">\n\t\t<img src="static/icon-phone.png" alt="" />\n\t\t<input class="phone" type="text" placeholder="\u8BF7\u8F93\u5165\u624B\u673A\u53F7\u7801"/>\n\t</div>\n</div>\n<div class="box">\n\t<div class="content">\n\t\t<img src="static/icon-man.png" alt="" />\n\t\t<input class="name" type="text" placeholder="\u79F0\u547C"/>\n\t</div>\n</div>\n<div class="box border-none">\n\t<div class="content content-info">\n\t\t<img class="info-icon" src="static/icon-question.png" alt="" />\n\t\t<span class="info-title">\u5907\u6CE8</span>\n\t\t<textarea class="info" name="info" rows="3" cols="">\n\t\t\t\n\t\t</textarea>\n\t</div>\n</div>\n\n<div class="btn" ng-click="send()">\u53D1\u9001</div>');
$templateCache.put('page/plp.html','\n<div class="head">\n\t<div class="head-icon">\n\t\t<img src="static/icon-6.png">\n\t</div>\n\t<div class="head-text">\n\t\t<p>\u4E3A\u4E86\u7ED9\u60A8\u63D0\u4F9B\u66F4\u4F18\u8D28\u7684\u670D\u52A1\uFF0C\u8BF7\u60A8\u4E3A\u6211\u6821\u63D0\u51FA\u5B9D\u8D35 \u610F\u89C1\u548C\u5EFA\u8BAE\uFF0C\u8C28\u5411\u60A8\u81F4\u4EE5\u6700\u771F\u8BDA\u7684\u8C22\u610F\u3002</p>\n\t</div>\n</div>\n\n<div class="box">\n\t<div class="box-item" ng-repeat="item in infoData.details" id="{{item.question.question_id}}">\n\t\t<p class="item-title">{{$index + 1}}\u3001{{item.question.question}}</p>\n\t\t<div class="item-aws" ng-repeat="answer in item.answer" id="{{answer.id}}" ng-click="clickItem(answer.id,item)">\n\t\t\t<i class="item-icon-success" ng-show="item.checkedId == answer.id"></i>\n\t\t\t<i class="item-icon-circle" ng-show="item.checkedId != answer.id"></i>\n\t\t\t<p>{{answer.answer}}</p>\n\t\t</div>\n\t</div>\n\n</div>\n\n<div class="bottom">\n\t<div class="btm-left">\n\t\t<p>\u5DF2\u5B8C\u6210 <span>{{checkNum}}</span>/{{infoData.details.length}}</p>\n\t</div>\n\t<div class="btm-right" ng-click="submit()">\n\t\t\u63D0\u4EA4\n\t</div>\n</div>');}]);

})();

//# sourceMappingURL=app.js.map
