// pages/mine/Colleague/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ZyModel: true,
    admin: 1,
    selectadmin: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
 
    that.setData({
      info: app.globalData.info
    })
    wx.request({
      url: app.globalData.api + 'Mine/GetColleague?company=' + that.data.info.company,
      success: function(res){
        that.setData({
          list: res.data.data,
          admin: res.data.admin
        })
      }
    })

    // 设置小程序标题
    wx.setNavigationBarTitle({
      title: '我的同事（转让管理员）'
    })
  },
  TabSwitch: function( e ){
    var that = this
    if ( that.data.info.id != that.data.admin ){
      that.Hint('只有管理员有此权限')
      return false
    } 
    this.setData({
      ZyModel: !this.data.ZyModel,
      selectadmin: e.currentTarget.dataset.user
    })
   

  },
  switchChange: function( e ){
    this.setData({
      ZyModel: !this.data.ZyModel
    })
  },
  CollForm: function( e ){
    var that = this
    var xy = e.detail.value
  
    wx.request({
      url: app.globalData.api + '/Usermore',
      data: e.detail.value,
      method: 'POST',
      success: function( res ){
        that.setData({
          ZyModel: !that.data.ZyModel,
          admin: xy.uid
        })
        that.onLoad()
      }
    })
    
  },
 
  // 弹框提示
  Hint: function (hint) {
    wx.showModal({
      title: '提示',
      content: hint,
      showCancel: false,
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