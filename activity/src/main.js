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
