// pages/mine/Register/next/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['北京市', '北京市', '东城区'],
    address: '',
    Thumb: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      show: options
    })
   console.log(that.data.show)
  },

  // 选中城市多选框后的值更改
  bindRegionChange: function (e) {
    this.setData({
      region: [e.detail.value[0], e.detail.value[1], e.detail.value[2]]
    })
  },

  // 选择地点
  ChangeAddress: function (e) {
    var that = this
    wx.authorize({
      scope: 'scope.userLocation',
      success() {
        wx.chooseLocation({
          success: function (res) {
            that.setData({
              address: res.address + res.name
            })
          }
        })
      }
    })
  },

  //  更换LOGO
  ChangeLogo: function (e) {
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

  SaveForm: function (e) {
    var that = this
    var XY = e.detail.value

    if( that.data.Thumb == '' ){
      that.RegisterHint('请上传公司LOGO')
      return false;
    } else if (XY.name == '') {
      that.RegisterHint('公司名称不能为空')
      return false;
    } else if ( XY.address == ''  ) {
      that.RegisterHint('公司详细地址不能为空')
      return false;
    } else {
      // 上传
      wx.uploadFile({
        url: app.globalData.api + 'Mine/SaveProThumb',
        filePath: '' + that.data.Thumb,
        name: 'file',
        success: function (spon) {
          XY.thumb = spon.data
          wx.request({
            url: app.globalData.api + 'Register/NextCompany',
            data: XY,
            method: 'POST',
            success: function (res) {
              that.RegisterHint(res.data.msg)
              app.globalData.info = res.data.data
              wx.setStorage({
                key: "UserInfo",
                data: res.data.data
              })
              wx.setStorage({
                key: "Hints",
                data: 1
              })
              setTimeout(function () {
                wx.reLaunch({
                  url: '/pages/mine/index'
                })
              }, 1000)
            }
          })

        }
      })
    }
    

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


})