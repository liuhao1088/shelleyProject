// pages/manage/live/edit.js
var util=require('../../../utils/util.js') 
let timer; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:util.formatTime(new Date()),nowDate:util.formatTime(new Date()),tempFilePaths:[],title:'',content:'',transmit:'',
    number:'' 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this; 
    if (options.data) { 
      let data = JSON.parse(options.data) 
      wx.setNavigationBarTitle({ 
        title: '编辑直播' 
      }) 
      that.setData({ 
        date:data.date,tempFilePaths:data.live_img,title:data.title,content:data.content,number:data.number,transmit:data 
      }) 
    }else{ 
      wx.setNavigationBarTitle({ 
        title: '添加直播' 
      }) 
    } 
  }, 
  changeDate:function(e){ 
    this.setData({date:e.detail.value}) 
  }, 
  inputTitle:function(e){ 
    this.setData({ 
      title:e.detail.value 
    }) 
  }, 
  inputContent:function(e){ 
    this.setData({ 
      content:e.detail.value 
    }) 
  }, 
  inputNumber:function(e){ 
    this.setData({ 
      number:e.detail.value 
    }) 
  }, 
  addImage: function () { 
    var that = this 
    wx.chooseImage({ 
      count: 1, // 默认9 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (res) { 
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
        var tempFilePaths = res.tempFilePaths 
        console.log(res.tempFilePaths) 
        that.setData({ 
          tempFilePaths: tempFilePaths 
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
  async submit() { 
    var _this = this; 
    if (_this.data.title == ""||_this.data.tempFilePaths==[] ) { 
      wx.showToast({ 
        title: '内容不能为空', 
        icon: 'none' 
      }) 
    } else { 
      if (_this.data.transmit == '') { 
        wx.showLoading({ 
          title: '提交中', 
        }) 
        if (timer) clearTimeout(timer); 
        timer = setTimeout(async res => { 
          wx.setStorageSync('refresh', 'has') 
          let arr=[] 
          if (_this.data.tempFilePaths !== []) await util.uploadimg(0, _this.data.tempFilePaths, 'live', arr) 
          await _this.add(arr); 
        }, 500) 
      } else { 
        if (timer) clearTimeout(timer); 
        timer = setTimeout(async res => { 
          wx.setStorageSync('refresh', 'has') 
          if (_this.data.transmit.live_img == _this.data.tempFilePaths) { 
            _this.update(_this.data.tempFilePaths); 
          } else { 
            let arr = []; 
            wx.cloud.deleteFile({ 
              fileList: _this.data.transmit.live_img, 
              success: res => { 
                // handle success 
                console.log(res.fileList) 
              }, 
              fail: err => { 
                // handle error 
              }, 
              complete: res => { 
                // ... 
              } 
            }) 
            if (_this.data.tempFilePaths !== []) await util.uploadimg(0, _this.data.tempFilePaths, 'live', arr) 
            await _this.update(arr); 
          } 
        }, 500) 
      } 
 
    } 
  }, 
  add: function (ig) { 
    var that = this; 
    var userInfo = wx.getStorageSync('userInfo') 
    var creation_date = util.formatTime(new Date()) 
    wx.showLoading({ 
      title: '提交中', 
    }) 
    wx.cloud.callFunction({ 
      name: 'recordAdd', 
      data: { 
        collection: 'live', 
        addData: { 
          creation_date: creation_date, 
          creation_timestamp: Date.parse(creation_date.replace(/-/g, '/')) / 1000, 
          title: that.data.title, 
          number: that.data.number,
          date: that.data.date, 
          timestamp: Date.parse(that.data.date.replace(/-/g, '/')) / 1000, 
          content:that.data.content, 
          live_img:ig, 
          status:'waiting' 
        } 
      } 
    }).then(res => { 
      console.log(res) 
      wx.hideLoading() 
      wx.showToast({ 
        title: '发布直播成功', 
        icon: 'success', 
        duration: 2000 
      }) 
      setTimeout(res => { 
        wx.navigateBack({ 
          delta: 1, 
        }) 
      }, 2000) 
    }).catch(error => { 
      wx.hideLoading() 
      wx.hideNavigationBarLoading() 
      wx.showModal({ 
        title: '服务器繁忙，请稍后重试', 
      }) 
    }) 
  }, 
  update: function (ig) { 
    var that = this; 
    wx.showLoading({ 
      title: '保存中', 
    }) 
    wx.cloud.callFunction({ 
      name: 'recordUpdate', 
      data: { 
        collection: 'live', 
        where: { 
          _id: that.data.transmit._id 
        }, 
        updateData: { 
          title: that.data.title, 
          date:that.data.date, 
          timestamp: Date.parse(that.data.date.replace(/-/g, '/')) / 1000, 
          content:that.data.content, 
          live_img:ig, 
        } 
      } 
    }).then(res => { 
      console.log(res) 
      wx.hideLoading() 
      wx.showToast({ 
        title: '保存成功', 
        icon: 'success', 
        duration: 2000 
      }) 
      setTimeout(res => { 
        wx.navigateBack({ 
          delta: 1 
        }) 
      }, 2000) 
    }).catch(error => { 
      wx.hideLoading() 
      wx.hideNavigationBarLoading() 
      wx.showModal({ 
        title: '服务器繁忙，请稍后重试', 
      }) 
    }) 
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