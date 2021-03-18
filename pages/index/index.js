//index.js
//获取应用实例

  var util = require('../../utils/util.js');
  var CryptoJS = require('../../utils/secret.js')
  var app = getApp();

  Page({
  data: {
    username:function(e) {
    var that = this;
    that.setData({
      userId: e.detail.value
    })
  },
    password:function(e) {
      var that = this;
      that.setData({
        userPassword: e.detail.value
      })
    },
    showTopTips: false,
    errorMsg: ""
  },
    onLoad: function () {
      var that = this;
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            windowHeight: res.windowHeight,
            windowWidth: res.windowWidth
          })
        }
      });
    },

    formSubmit: function (e) {
      // form 表单取值，格式 e.detail.value.name(name为input中自定义name值) ；使用条件：需通过<form bindsubmit="formSubmit">与<button formType="submit">一起使用  
      var that = this;
      var userId = e.detail.value.userId;
      var userPassword = e.detail.value.userPassword;
      // 判断账号是否为空和判断该账号名是否被注册  
      wx.request({
        url: "http://localhost:8091/api/login",
        data:{'userId':userId, 'userPassword': CryptoJS.Encrypt(userPassword)},
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.setStorage({
            data: res.data.data.token,
            key: 'Authorization',
          })
          wx.setStorage({
            data: res.data.data.userId,
            key: 'userId',
          })
          wx.setStorage({
            data: res.data.data.authority,
            key: 'authority',
          })
          wx.navigateTo({
            url: '/pages/user/index/index?username=' + res.data.data.userId,
          })
        },
        fail: function(res) {
          wx.showToast({
            title: '用户名或密码错误',
          })
        }
      })
    }

})  



