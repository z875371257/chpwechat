// pages/mine/Register/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Company:true,
    CompanyName: '',
    mobile: '',
    second: 90,
    SendView: '获取验证码',
    code: '',
    sends: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置小程序标题
    wx.setNavigationBarTitle({
      title: '用户注册'
    })
  },

  GoLogin: function( e ){
    wx.navigateTo({
      url:  '/pages/mine/Login/index'
    })
  },

  RegisterForm: function( e ){
    var that = this
    var FD = e.detail.value

    if( FD.nickname == ''){
      that.RegisterHint('姓名不能为空')
      return false;
    } else if ( FD.password.length < 6 || FD.password.length > 14 ){
      that.RegisterHint('密码长度为6-14')
      return false;
    } else if( FD.email == ''){
      that.RegisterHint('邮箱不能为空')
      return false;
    } else if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(FD.email)) {
      that.RegisterHint('邮箱格式错误')
      return false;
    } else if ( FD.company == '' ){
      that.RegisterHint('所在单位不能为空')
      return false;
    } else if ( FD.posts  == '') {
      that.RegisterHint('职务不能为空')
      return false;
    } else if ( FD.mobile == '' ){
      that.RegisterHint('手机号不能为空')
      return false;
    }  else  if ( FD.code != that.data.code ) {
      that.RegisterHint('验证码错误')
      return false;
    } else if (FD.code == ''){
      that.RegisterHint('验证码不能为空')
      return false;
    }
   
    delete FD['code']
    wx.request({
      url: app.globalData.api + 'Register',
      method: 'POST',
      data: FD,
      success: function( res ) {
        if ( res.data.code == 200 ){
          that.RegisterHint(res.data.msg);
          wx.setStorage({
            key: "UserInfo",
            data: res.data.data
          })
          wx.setStorage({
            key: "Hints",
            data: 1
          })
          app.globalData.info = res.data.data
          var pages = getCurrentPages();  //获取当前打开的页面栈，返回为数组，索引顺序为打开的顺序
          var prePages = pages[pages.length - 2];  //获取到上一个页面对象
          prePages.onLoad();  //执行上一个页面对象中的刷新数据方法
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)
        } else if ( res.data.code == 201){
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success( res ){
              wx.navigateTo({
                url: 'next/index?nickname=' + FD.nickname + '&password=' + FD.password + '&email=' + FD.email + '&posts=' + FD.posts + '&mobile=' + FD.mobile + '&company=' + FD.company
              })
            }
          })
        } else {
          that.RegisterHint(res.data.msg);
        }
      }
    })
    
  },

  // 弹框提示
  RegisterHint: function( hint ){
    wx.showModal({
      title: '提示',
      content: hint,
      showCancel: false,
    })
  },

  // 公司搜索
  CompanySearch: function( e ){
    var that = this 

    if( e.detail.value == ''){
      that.setData({
        Company:true
      })
    }
    wx.request({
      url: app.globalData.api+'SearchCompany?name=' + e.detail.value,
      success:function( res ) {
        that.setData({
          CompanyList: res.data,
          Company: false
        })
      }
    })
  },

  // 搜索出的公司点击事件
  CompanyValue:function(e){
    this.setData({
      CompanyName: e.currentTarget.dataset.name,
      Company: true,
    })
  },
  
  // 手机号赋值
  MobileInput: function( e ){
    this.setData({
      mobile: e.detail.value
    })
  },

  // 验证码获取事件
  GetCode: function( e ){
    var that = this

    if ( that.data.sends != 0 ) {
      return false
    }

    if (that.data.SendView != '获取验证码' ){
      return false;
    } 

    var mobile = that.data.mobile
    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if ( !myreg.test(mobile) ){
      that.RegisterHint('请输入正确的手机号')
      return false;
    } else {
      wx.request({
        url: app.globalData.api + 'Validate/checkTel?tel=' + mobile,
        success: function (e) {
          if (e.data.data != 0) {
            that.RegisterHint(e.data.message)
            return false;
          } else {
            that.timer()
            wx.request({
              url: app.globalData.api + 'Validate/SendCode?mobile=' + mobile,
              success: function (res) {
                that.setData({
                  code: res.data.data,
                  sends: 1
                })
              }
            })
          }
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
            SendView: this.data.second - 1 +'s'
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 90,
              SendView: '获取验证码',
              sends: 0
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