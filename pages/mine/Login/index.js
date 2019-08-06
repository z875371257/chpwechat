// pages/mine/Login/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Login: false,
    TelLogin: true,
    menu1: true,
    menu2: false,
    second: 90,
    SendView: '获取验证码',
    code: '',
    mobile: '',
    sends: true 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置小程序标题
    wx.setNavigationBarTitle({
      title: '用户登录'
    })
  },

  // Menu切换
  ShowCut: function (e) {
    if (e.currentTarget.dataset.id == 1) {
      this.setData({
        menu1: true,
        menu2: false,
      })
    } else if (e.currentTarget.dataset.id == 2) {
      this.setData({
        menu1: false,
        menu2: true,
      })
    } 
  },

  // 手机号快捷登录
  getPhoneNumber: function( e ) {
    var ivObj = e.detail.iv
    var telObj = e.detail.encryptedData  
    var code = ''
    var that = this 

    wx.login({
      success: res => {
        wx.request({
          url: app.globalData.api + 'Wx_login', //接口地址
          data: {
            code: res.code,
            encryptedData: telObj,
            iv: ivObj
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (spon) {
            if( spon.data == false) {
              wx.navigateTo({
                url: 'pages/mine/Register/index'
              })
          
            } else {
              wx.request({
                url: app.globalData.api + '/Login/Phonelogin',
                data: {
                  mobile: spon.data.phoneNumber
                },
                success: function (ress) {
                  if (ress.data != 0) {
                    wx.showToast({
                      title: '登录成功',
                      icon: 'success',
                      duration: 2000,
                      success: function (e) {
                        wx.setStorage({
                          key: "UserInfo",
                          data: ress.data
                        })
                        wx.setStorage({
                          key: "Hints",
                          data: 1
                        })
                        wx.setStorage({
                          key: "Pop",
                          data: 1
                        })
                        wx.reLaunch({
                          url: '/pages/mine/index'
                        })
                        app.globalData.info = ress.data
                      }
                    })
                  } else {
                    wx.navigateTo({
                      url: 'Userreg/index?mobile=' + spon.data.phoneNumber
                    })
                  }
                }
              })
            }
            
            

          }
        })
      }
    });

    //---------登录有效期检查
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail: function () {
        // session_key 已经失效，需要重新执行登录流程
        wx.login() //重新登录
      }
    });

  },

  // 点击授权登录
  bindGetUserInfo: function( e ){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this
    // 先登录
    wx.login({
      success(res) {
        if (res.code) {
          // 获取code后 获取用户信息
          wx.getUserInfo({
            // 用户信息获取成功后 请求登录接口 将iv 等信息传过去 用于解密获取unionId
            success(gres) {
              wx.request({
                url: app.globalData.api + 'Wx_login',
                data: {
                  code: res.code,
                  encryptedData: gres.encryptedData,
                  iv: gres.iv
                },
                success: function( spon ){
                // 请求成功后返回了用户的unionID 将UnionId发到后台进行查找
                  wx.request({
                    url: app.globalData.api + 'Login/Wechatlogin',
                    data: {
                      unionid: spon.data.unionId,
                      headimg: spon.data.avatarUrl
                    },
                    success: function( bb) {
                      // 如果此微信已经绑定 则将登录信息返回登录成功  否则进入注册页面
                      if( bb.data != 0){
                        wx.showToast({
                          title: '登录成功',
                          icon: 'success',
                          duration: 1000,
                          success: function (e) {
                            wx.setStorage({
                              key: "UserInfo",
                              data: bb.data
                            })
                            wx.setStorage({
                              key: "Hints",
                              data: 1
                            })
                            wx.setStorage({
                              key: "Pop",
                              data: 1
                            })
                            wx.reLaunch({
                              url: '/pages/mine/index'
                            })
                            app.globalData.info = bb.data
                          }
                        })
                      } else {
                        wx.hideLoading()
                        that.setData({
                          Login: true,
                          unionId: spon.data.unionId
                        })
                        wx.setStorage({
                          key: "WxInfo",
                          data: spon.data
                        })
                      }
                    }
                  })
                }
              })
            },
            fail(res) {
              wx.hideLoading()
            }
            
          })

        }
      }
    })

    
  },

  // 账号密码登录
  LoginForm: function( e ){
    var that = this
    var FD = e.detail.value
    
    // 手机号查询判断 
    if (FD.name == '') {
      that.RegisterHint('用户名不能为空')
      return false;
    } else if ( FD.password == ''){
      that.RegisterHint('密码不能为空')
      return false;
    }
    FD.web = 2;
    wx.request({
      url: app.globalData.api + 'Login',
      method: 'POST',
      data: FD,
      success: function (res) {
        
       if (res.data != 2 ){
         wx.showToast({
           title: '登录成功',
           icon: 'success',
           duration: 1000,
           success: function (e) {
             wx.setStorage({
               key: "UserInfo",
               data: res.data
             })
             wx.setStorage({
               key: "Hints",
               data: 1
             })
             wx.setStorage({
               key: "Pop",
               data: 1
             })
             wx.reLaunch({
               url: '/pages/mine/index'
             })
             app.globalData.info = res.data
           }
         })

       } else {
         that.RegisterHint('用户名密码错误')
       }
      }
    })
    

  },

  // 去注册
  GoRegister: function (e) {
    wx.navigateTo({
      url: '/pages/mine/Register/index'
    })
  },

  //  Tel表单提交 
  TelForm: function( e ){
    var that = this
    var FD = e.detail.value

    if (FD.code == '') {
      that.RegisterHint('请输入短信验证码')
      return false;
    }
    // 验证码判断
    if (FD.code != that.data.code) {
      that.RegisterHint('验证码错误')
      return false;
    }

    FD.unionid = that.data.unionId
    
    wx.request({
      url: app.globalData.api + 'Login/Tellogin',
      method: 'POST',
      data: FD,
      success: function (res) {
        if (res.data != 0) {
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000,
            success: function (e) {
              wx.setStorage({
                key: "UserInfo",
                data: res.data
              })
              wx.setStorage({
                key: "Hints",
                data: 1
              })
              wx.reLaunch({
                url: '/pages/mine/index'
              })
              app.globalData.info = res.data
            }
          })
        } else {
          wx.navigateTo({
            url: 'Userreg/index?mobile=' + that.data.mobile
          })
        }
      }
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
      if( that.data.sends ){
        that.timer()
        wx.request({
          url: app.globalData.api + 'Validate/SendCode?mobile=' + mobile,
          success: function (res) {
            that.setData({
              code: res.data.data,
              sends: false
            })
          }
        })
      }
    }

  },
  // 手机号丧失焦点事件 方便获取短信
  TelBlur: function( e ){
    this.setData({
      mobile: e.detail.value
    })
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
              second: 60,
              SendView: '获取验证码',
              sends: true
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

  LoginWay: function(){
    this.setData({
      TelLogin: !this.data.TelLogin
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