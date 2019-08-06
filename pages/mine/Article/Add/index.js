// pages/mine/Article/Add/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Thumb: '',
    ThumbData: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarTitle({
      title: '添加采购'
    })
    that.setData({
      info: app.globalData.info
    })
   
  },

  ChangeThumb: function (e) {
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
    var FD = e.detail.value
    if (FD.title == '') {
      that.RegisterHint('采购标题不能为空');
      return false;
    } else if (FD.pname == '') {
      that.RegisterHint('采购产品不能为空')
      return false;
    }

    // 上传
    wx.uploadFile({
      url: app.globalData.api + 'Mine/SaveProThumb',
      filePath: '' + that.data.Thumb,
      name: 'file',
      success: function (spon) {
        FD.thumb = spon.data
        wx.request({
          url: app.globalData.api + 'Mine/AddArticle',
          data: FD,
          method: 'POST',
          success: function (res) {
            if (res.data == 1) {
              that.RegisterHint('添加成功')
              var pages = getCurrentPages();  //获取当前打开的页面栈，返回为数组，索引顺序为打开的顺序
              var prePages = pages[pages.length - 2];  //获取到上一个页面对象
              prePages.GetArticle();  //执行上一个页面对象中的刷新数据方法
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                })
              }, 1000)
            }
          }
        })

      }
    })



  },
  ViewImage: function (e) {
    wx.previewImage({
      current: '' + e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: ['' + e.currentTarget.dataset.url] // 需要预览的图片http链接列表
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

})