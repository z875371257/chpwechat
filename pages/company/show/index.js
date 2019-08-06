// pages/company/show/index.js
const app = getApp()
const wxParser = require('../../../wxParser/m');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu1: true,
    menu2: false,
    menu3: false,
    dynamic: {
      data:{
        0: 1,
        1: 2,
        2: 3,
        3:4,
      },
      count:4
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ( e ) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.api + 'Company/show?id=' + e.id,
      success: function (res) {
        // 获取文章详情  将图片大小宽度百分百
        var content = res.data.content
        res.data.content = content.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
        // 设置小程序标题
        wx.setNavigationBarTitle({
          title: res.data.name
        })
        // 赋值接口内容给show
        that.setData({
          show: res.data,
        })
        //  wxParser插件展示详情页
        wxParser.parse({
          bind: 'richText',
          html: res.data.content,
          target: that
        })
        // 关闭加载中状态
        wx.hideLoading()
      }
    })
  },
  // 产品内页跳转
  ProductShow: function (res) {
    wx.navigateTo({
      url: '/pages/product/show/index?id=' + res.currentTarget.dataset.id
    })
  },
  // Menu切换
  ShowCut: function( e ) {
    if ( e.currentTarget.dataset.id == 1) {
      this.setData({
        menu1: true,
        menu2: false,
        menu3: false,
      })
    } else if (e.currentTarget.dataset.id == 2 ){
      this.setData({
        menu1: false,
        menu2: true,
        menu3: false,
      })
    } else {
      this.setData({
        menu1: false,
        menu2: false,
        menu3: true,
      })
    }


  },
  ShowCard: function( e ){
    wx.navigateTo({
      url: '/pages/company/card/index?id=' + e.currentTarget.dataset.id
    })
  },
  ViewImage: function (e) {
    var res = []
    for (var index in this.data.show.validate) {
      res[index] = this.data.show.validate[index].thumb;
    }
    wx.previewImage({
      current: '' + e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: res // 需要预览的图片http链接列表
    })
  },

  GoHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})