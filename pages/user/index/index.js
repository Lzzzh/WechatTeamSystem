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
    username: 0,
    userId: '',
    projectList: [],
    userList:[],
    receiverList: [],
    message: ''
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
          username:options.username
        });
      }
    });
  },
  checkboxChange: function (e) {
    var that = this
    var store_id = e.currentTarget.dataset.id; //一级id
    var checkArr = e.currentTarget.dataset.parent_id; //一级id
    var allCheackList = []
    var userList = that.data.userList;
    userList[checkArr].checked = !userList[checkArr].checked
    if (userList[checkArr].checked == true) {
      for (var j = 0; j < userList[checkArr].children.length; j++) {
        userList[checkArr].children[j].checked = true
      }
    } else {
      for (var j = 0; j < userList[checkArr].children.length; j++) {
        userList[checkArr].children[j].checked = false
      }
    }
    that.selectLists()
    this.setData({
      userList: userList,
    })
  },
  /**
   * 二级选择
   */
  childChange: function (e) {
    var that = this
    var checkArr = e.currentTarget.dataset.child_id;
    var label = e.currentTarget.dataset.label;
    var id = e.currentTarget.dataset.id; //二级的
    var userList = that.data.userList;
    for (var j = 0; j < userList.length; j++) {
      if (userList[j].label == label) {
        userList[j].children[id].checked = !userList[j].children[id].checked
        // console.log(userList[j].children[id])
        var cheackListOne = []
        for (var k = 0; k < userList[j].children.length; k++) {
          if (userList[j].children[k].checked == true) {
            cheackListOne.push(userList[j].children[k].checked)
          }
          if (userList[j].children.length == cheackListOne.length) {
            userList[j].checked = true
          } else {
            userList[j].checked = false
          }
        }
      }
    }
    that.selectLists()
    that.setData({
      userList: userList,
    })
  },
  // 传给后台的商品id 函数
  selectLists: function () {
    var userList = this.data.userList;
    var goods_itemlistsTwo = []
      for (var j = 0; j < userList.length; j++) {
        var children = userList[j].children
        for (var k = 0; k < children.length; k++) {
          if (children[k].checked == true) {
            // goods_itemlistsTwo.push(goods_item[k].goods_id)
            goods_itemlistsTwo.push(
              children[k].value
            )
          }
        }
    }
    // console.log(goods_itemlistsTwo)
    // console.log(cheaclLists)
    this.setData({
      receiverList: goods_itemlistsTwo, //传给后台的商品id
    })
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
  getUserList: function () {
    var that = this;
    var userId = wx.getStorageSync('userId')
    var Authorization = wx.getStorageSync('Authorization')
    wx.request({
      url: 'http://localhost:8091/api/getUserList',
      method: 'GET',
      header: {
        'Authorization': Authorization
      },
      scriptCharset: 'utf-8',
      success: function (res){
        var userList = res.data.data;
        userList.forEach((item => {
          const children = item.children;
          children.forEach((map) => {
              if (map.value === userId) {
                  const index = children.valueOf(map);
                  children.splice(index, 1);}
              })
      }))
        that.setData({
          userList: userList
        })
      }
    })
  },
  showProjectList: function () {
    var that = this;
    var userId = wx.getStorageSync('userId')
    var Authorization = wx.getStorageSync('Authorization')
    var url = ''
    var authority = wx.getStorageSync('authority')
    if (authority == "0") {
        url = "http://localhost:8091/api/wechatStudentProjectList"
    }else if (authority == "1") {
      url = "http://localhost:8091/api/wechatTeacherProjectList"
    }
    wx.request({
      url: url,
      data: { 'userId': userId },
      method: "GET",
      header: {
        'Authorization': Authorization
      },
      scriptCharset: 'utf-8',
      success: function (res) {
        console.log(res.data.data);
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
  },
  //发消息
  submit: function () {
    var that = this;
    var userId = wx.getStorageSync('userId')
    var Authorization = wx.getStorageSync('Authorization')
    wx.request({
      url: 'http://localhost:8092/wechat-service/sendMessage',
      data: {
        "senderId": userId,
        "content": that.data.message,
        "receiverList": that.data.receiverList
      },
      method: "POST",
      header: {
        'Authorization': Authorization
      },
      success: function(res) {
        var userList = that.data.userList;
        for(var i = 0; i < userList.length; i++) {
          for(var j = 0; j < userList[i].children.length; j++) {
            userList[i].children[j].checked = false;
          }
        }
        that.setData({
          userList: userList,
          message: ''
        })
      }
    })
  },
  onShow: function () {
    this.showProjectList();
    this.getUserList();
  },
  searchScrollLower: function () {
    var that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        pagenum: that.data.pagenum + 1,  //每次触发上拉事件，把searchPageNum+1  
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
      });
      that.showCourse();
      console.log(pagenum);
    }
  },
  bindKeyInput: function (e) {
    this.setData({
      message: e.detail.value
    })
  },
})  