// pages/index/ArticleShow/index.js
const app = getApp()
const wxParser = require('../../../wxParser/chp.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: 'https://www.chplaza.com.cn/api/AppletArticle?id=' + options.id,
      success: function( res ){
        wx.setNavigationBarTitle({
          title: res.data.title
        })
        var content = res.data.content
        res.data.content = content.replace(/\<img/gi, '<img style="width:100%;height:auto" ')

        that.setData({
          show: res.data
        })
        //  wxParser插件展示详情页
        wxParser.parse({
          bind: 'richText',
          html: res.data.content,
          target: that
        })
        wx.hideLoading()
       
      }
    })
  },
  GoHome: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  // 文章内页跳转
  ChpArticleShow: function (res) {
    wx.navigateTo({
      url: '/pages/index/ArticleShow/index?id=' + res.currentTarget.dataset.id
    })
  },

  CommentForm: function( res ){
    var xy = res.detail.value
    if ( xy.message == '' ){
      app.Hint('评论内容不能为空')
      return false;
    }
    if( app.globalData.info == '' ){
      app.Hint('请先登录！')
      return false;
    } 
    xy.user_id = app.globalData.info.id
    var that = this 
    wx.request({
      url: 'https://www.chplaza.com.cn/api/AppletArticle/Save',
      data: xy,
      method: 'post',
      success: function( res ){
        app.Hint('res.data.msg')
        that.onLoad();
      }
    })
    console.log(xy)

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