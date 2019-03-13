

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
