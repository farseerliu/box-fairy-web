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