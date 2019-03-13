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