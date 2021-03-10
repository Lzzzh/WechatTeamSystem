//index.js  
//获取应用实例  
var app = getApp()
var util = require('../../../utils/util.js');
Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
    clientHeight: 0,
    // tab切换  
    currentTab: 0,
    hasMoreData: true,
    isFromSearch: true,   // 用于判断courselist数组是不是空数组，默认true，空的数组
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    courselist: [],
    selectedCourseList: [],
    studentlist: [],
    username: 0,
    userId: '',
    projectList: []
  },
  onLoad: function (options) {
    var that = this;

    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          clientHeight: res.windowHeight - 50,
          userId: options.userId
        });
      }

    });
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    if (e.target.dataset.current == 0) {

    } else if (e.target.dataset.current == 1) {

    }
  },
  showProjectList: function () {
    var that = this;
    var userId = wx.getStorageSync('userId');
    var Authorization = wx.getStorageSync('Authorization');
    wx.request({
      url: "http://localhost:8091/api/wechatStudentProjectList",
      data: { 'userId': userId },
      method: "GET",
      header: {
        'Authorization': Authorization
      },
      success: function (res) {
        if (res.data.data != null) {
          that.setData({
            searchLoading: true,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false, //把“没有数据”设为false，隐藏 
            projectList: res.data.data
          })
        } else {
          that.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示  
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
          })
        }
      }
    });
  }
  
  
})  