// pages/mine/UserInfo/edit/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: '',
    mobile: '',
    second: 90,
    SendView: '获取验证码',
    code: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ( e ) {
    wx.setNavigationBarTitle({
      title: '手机号修改'
    })

    this.setData({
      info: app.globalData.info
    })
  },

  // 手机号赋值
  MobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  // 验证码获取事件
  GetCode: function (e) {
    var that = this
    var mobile = that.data.mobile
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if (!myreg.test(mobile)) {
      that.RegisterHint('请输入正确的手机号')
      return false;
    } else {
      that.timer()
      wx.request({
        url: app.globalData.api + 'Validate/SendCode?mobile=' + mobile,
        success: function (res) {
          that.setData({
            code: res.data.data
          })
        }
      })
    }

  },

  // 点击验证码倒计时
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1,
            SendView: this.data.second - 1 + 's'
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 90,
              SendView: '获取验证码'
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },

  RegisterHint: function (hint) {
    wx.showModal({
      title: '提示',
      content: hint,
      showCancel: false,
    })
  },

  // 表单提交
  RegisterForm: function( e ){
    var that = this
    var FD = e.detail.value
    
    if(FD.code == ''){
      that.RegisterHint('请输入短信验证码')
      return false;
    }
    // 验证码判断
    if (FD.code != that.data.code) {
      that.RegisterHint('验证码错误')
      return false;
    }
    FD.user_id = that.data.info.id
    delete FD['code']
    wx.request({
      url: app.globalData.api + 'Usermore/SaveTel',
      method: 'POST',
      data: FD,
      success: function(res){
        if(res.data){
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000,
          })
          that.data.info.mobile = FD.tel
          wx.setStorage({
            key: "UserInfo",
            data: that.data.info
          })
          var pages = getCurrentPages();  //获取当前打开的页面栈，返回为数组，索引顺序为打开的顺序
          var prePages = pages[pages.length - 2];  //获取到上一个页面对象
          prePages.onLoad();  //执行上一个页面对象中的刷新数据方法
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)
       
        }
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