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