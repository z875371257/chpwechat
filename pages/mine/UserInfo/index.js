// pages/mine/UserInfo/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      info: app.globalData.info
    })

    // 设置小程序标题
    wx.setNavigationBarTitle({
      title: '个人信息修改'
    })
    
  },
  // 手机号修改跳转
  EditTel: function( e ) {
    wx.navigateTo({
      url: 'edit/index'
    })
  },
  // 邮箱修改跳转
  EditEmail: function (e) {
    wx.navigateTo({
      url: 'edit/Email'
    })
  },
  // 职务修改跳转
  EditPosts: function (e) {
    wx.navigateTo({
      url: 'edit/Posts'
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


})