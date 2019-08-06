const app = getApp()

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
    wx.setNavigationBarTitle({
      title: '荣誉证书'
    })
    that.setData({
      info: app.globalData.info
    })
    that.GetProduct();
  },
  AddProduct: function () {
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
        // 上传
        wx.uploadFile({
          url: app.globalData.api + 'Mine/SaveValidate?name=' + that.data.info.company,
          filePath: '' + res.tempFilePaths,
          name: 'file',
          success: function (e) {
            that.GetProduct()
          }
        })
      }
    })
  },
  DelData: function (e) {
    var that = this
    if (app.globalData.info.id != app.globalData.info.user_id) {
      app.Hint('只有管理员有此操作')
      return false;
    }
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.api + 'Mine/RemoveValidate?id=' + e.currentTarget.dataset.id,
            success: function (e) {
              that.GetProduct();
            }
          })
        }
      }
    })
  },

  GetProduct: function () {
    var that = this
    wx.request({
      url: app.globalData.api + 'Mine/ValidateList?company=' + that.data.info.company,
      success: function (res) {
        that.setData({
          ProductList: res.data
        })
        wx.hideLoading()
      }
    })
  },

  ViewImage: function (e) {
    wx.previewImage({
      current: '' + e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: ['' + e.currentTarget.dataset.url] // 需要预览的图片http链接列表
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

})