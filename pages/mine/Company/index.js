// pages/mine/Company/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['北京市', '北京市', '东城区'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      info: app.globalData.info
    })

    that.GetCompany()
  },
  bindRegionChange: function( e ){
    this.setData({
      region: [e.detail.value[0], e.detail.value[1], e.detail.value[2]  ]
    })
  },
  
  EditCompanyInfo: function (e) {
    if (app.globalData.info.id != app.globalData.info.user_id) {
      app.Hint('只有管理员有此操作')
      return false;
    }
    wx.navigateTo({
      url: 'edit/index?id=' + e.currentTarget.dataset.id
    })
  },

  GetCompany: function(){
    var that = this
    wx.request({
      url: app.globalData.api + 'Mine/CompanyShow?company_id=' + that.data.info.company_id,
      success: function (e) {
        that.setData({
          show: e.data.data,
          region: [ e.data.data.province, e.data.data.city, e.data.data.district ],
          thumb: 'https://chplaza-cn.oss-cn-beijing.aliyuncs.com/' + e.data.data.thumb
        })
      }
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