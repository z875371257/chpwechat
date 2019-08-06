// pages/mine/Company/edit/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['北京市', '北京市', '东城区'],
    address: '',
    Thumb:'',
    BigThumb: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.globalData.api + 'Mine/CompanyShow?company_id=' +  options.id,
      success: function( res ){
        that.setData({
          show: res.data.data,
          address: res.data.data.address,
          Thumb: 'https://chplaza-cn.oss-cn-beijing.aliyuncs.com/' + res.data.data.thumb,
          BigThumb: res.data.data.thumb,
          region: [ res.data.data.province, res.data.data.city, res.data.data.district ]
        })
      }
    })
  },

  bindRegionChange: function (e) {
    this.setData({
      region: [e.detail.value[0], e.detail.value[1], e.detail.value[2]]
    })
  },

  ChangeAddress: function( e ) {
    var that = this 
    wx.chooseLocation({
      success: function(res){
        that.setData({
          address: res.address + res.name
        })
      }
    })
  },

  ChangeLogo: function( e ){
    var that = this 
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          Thumb: res.tempFilePaths
        })
      }
    })
  },

  SaveForm: function( e ){
    var that = this
    var XY = e.detail.value

    if ( XY.name == '' ){
      that.RegisterHint('公司名称不能为空')
      return false;
    } else if (that.data.Thumb == 'https://chplaza-cn.oss-cn-beijing.aliyuncs.com/' + that.data.BigThumb ) {
      console.log(XY)
      
      wx.request({
        url: app.globalData.api + 'Mine/CompanyEdit',
        method: 'POST',
        data: XY,
        success: function( res ) {
          that.RegisterHint('修改成功')
          var pages = getCurrentPages();  //获取当前打开的页面栈，返回为数组，索引顺序为打开的顺序
          var prePages = pages[pages.length - 2];  //获取到上一个页面对象
          prePages.GetCompany();  //执行上一个页面对象中的刷新数据方法
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)
        }
      })
      return false;
    }
    // 上传
    wx.uploadFile({
      url: app.globalData.api + 'Mine/SaveProThumb',
      filePath: '' + that.data.Thumb,
      name: 'file',
      success: function (spon) {
        XY.thumb = spon.data
        console.log(XY)
        wx.request({
          url: app.globalData.api + 'Mine/CompanyEdit',
          data: XY,
          method: 'POST',
          success: function (res) {
              that.RegisterHint('添加成功')
              var pages = getCurrentPages();  //获取当前打开的页面栈，返回为数组，索引顺序为打开的顺序
              var prePages = pages[pages.length - 2];  //获取到上一个页面对象
              prePages.GetCompany();  //执行上一个页面对象中的刷新数据方法
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                })
              }, 1000)
          }
        })
      }
    })

  },
  RegisterHint: function (hint) {
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