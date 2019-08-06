// pages/mine/CompanyRz/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Rz: false,
    Thumb: '',
    Status: 0,
    Pop: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    // 设置小程序标题
    wx.setNavigationBarTitle({
      title: '公司认证'
    })

    wx.request({
      url: app.globalData.api + 'Mine/CompanyRz',
      method: 'POST',
      data: app.globalData.info,
      success: function (spon) {
        if (spon.data.code == 201) {
          that.setData({
            Status: 2
          })
        } else {
          that.setData({
            Status: spon.data.data.status,
            Thumb: spon.data.data.thumb,
            PopThumb: spon.data.data.pop,
          })
        }
      }
    })
  },

  ViewImage: function( e ){
    wx.previewImage({
      current: '' + e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: ['' + e.currentTarget.dataset.url] // 需要预览的图片http链接列表
    })
  },

  ChangeThumb: function (e) {
    var that = this
    if (app.globalData.info.id != app.globalData.info.user_id) {
      app.Hint('只有管理员有此操作')
      return false;
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          Thumb: res.tempFilePaths
        })
        // 上传
        wx.uploadFile({
          url: app.globalData.api + 'Usermore/SaveLicense?name=' + app.globalData.info.company ,
          filePath: ''+res.tempFilePaths,
          name: 'file',
          success: function( spon ){
            wx.getStorage({
              key: 'Pops',
              success: function (res) {
                that.setData({
                  Pop: true
                })
              },
              fail: function () {
                that.setData({
                  Pop: false
                })
              }
            })
           
          }
        })
      }
    })
  },

  // 关闭弹框广告
  Closes: function () {
    this.setData({
      Pop: true,
    })
    wx.setStorage({
      key: "Pops",
      data: 1
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