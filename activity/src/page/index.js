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