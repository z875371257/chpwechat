// pages/mine/Product/Add/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Thumb: '',
    ThumbData: '',
    multiArray: [],
    multiIndex: [0, 0, 0],
    cate_id: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarTitle({
      title: '产品修改'
    })
    that.setData({
      info: app.globalData.info
    })

    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }

    wx.request({
      url: app.globalData.api + 'Mine/ViewProduct?id=' + options.id,
      success: function( e ){
        data.multiArray = e.data.cate
        data.show = e.data,
        data.Thumb =  'https://chplaza-cn.oss-cn-beijing.aliyuncs.com' + e.data.thumb,
        data.ThumbData = e.data.thumb,
        data.multiIndex = e.data.cate_index
        that.setData(data)
      }
    })
  },

  bindMultiPickerColumnChange(e) {
    var that = this
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }
    data.multiIndex[e.detail.column] = e.detail.value
    switch (e.detail.column) {
      case 0:
        wx.request({
          url: app.globalData.api + 'Mine/GetTwoCate?key=' + data.multiIndex[0],
          success: function (res) {
            data.multiArray[1] = res.data[0]
            data.multiArray[2] = res.data[1]
            that.setData(data)
          }
        })
        break
      case 1:
        wx.request({
          url: app.globalData.api + 'Mine/GetThreeCate?key=' + data.multiIndex[0] + '&index=' + data.multiIndex[1],
          success: function (res) {
            data.multiArray[2] = res.data
            that.setData(data)
          }
        })
        break
    }
  },

  bindRegionChange: function (e) {
    var that = this
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: e.detail.value
    }
    that.setData(data)
    wx.request({
      url: app.globalData.api + 'Mine/CateQuery',
      data: e.detail.value,
      success: function (res) {
        that.setData({
          cate_id: res.data
        })
      }
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
    var FD = e.detail.value;
    var BigThumb = 'https://chplaza-cn.oss-cn-beijing.aliyuncs.com' +that.data.ThumbData;

    if (FD.name == '') {
      that.RegisterHint('产品名称不能为空');
      return false;
    } else if (FD.price == '') {
      that.RegisterHint('产品价格不能为空')
      return false;
      // 如果表单的封面图和原有的一样直接修改 否则 上传图片修改
    } else if (that.data.Thumb ==  BigThumb ){
      wx.request({
        url: app.globalData.api + 'Mine/AddProduct',
        data: FD,
        method: 'POST',
        success: function (res) {
          if (res.data == 1) {
            that.RegisterHint('修改成功')
            var pages = getCurrentPages();  //获取当前打开的页面栈，返回为数组，索引顺序为打开的顺序
            var prePages = pages[pages.length - 2];  //获取到上一个页面对象
            prePages.GetProduct();  //执行上一个页面对象中的刷新数据方法
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 1000)
          }
        }
      })
      return false
    }
    // 上传
    wx.uploadFile({
      url: app.globalData.api + 'Mine/SaveProThumb',
      filePath: '' + that.data.Thumb,
      name: 'file',
      success: function (spon) {
        FD.thumb = spon.data
        wx.request({
          url: app.globalData.api + 'Mine/AddProduct',
          data: FD,
          method: 'POST',
          success: function (res) {
            if (res.data == 1) {
              that.RegisterHint('修改成功')
              var pages = getCurrentPages();  //获取当前打开的页面栈，返回为数组，索引顺序为打开的顺序
              var prePages = pages[pages.length - 2];  //获取到上一个页面对象
              prePages.GetProduct();  //执行上一个页面对象中的刷新数据方法
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