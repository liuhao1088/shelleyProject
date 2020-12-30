// pages/reservationActivity/reservationActivity.js
const util = require('../../utils/util');
let date = util.formatTime(new Date())
let timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: '2021-01-10 12:00',
    endTime: '2021-01-10 12:00',
    title: '',
    content: ''
  },
  changeStartTime(e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  changeEndTime(e) {
    console.log(e)
    this.setData({
      endTime: e.detail.value
    })
  },
  inputContent(e) {
    this.setData({
      content: e.detail.value
    })
  },
  inputTitle: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      startTime: date,
      endTime: date
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
    if (!this.data.title) {
      wx.showToast({
        title: '请输入活动标题',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!this.data.title) {
      wx.showToast({
        title: '请输入活动标题',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (this.data.startTime === date) {
      wx.showToast({
        title: '请选择开始时间',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (this.data.endTime === date) {
      wx.showToast({
        title: '请选择截止时间',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!this.data.content) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 2000
      })
      return;
    }



    if (this.data.title !== '' && this.data.content !== '') {
      var that = this;
      wx.showLoading({
        title: '提交中',
      })
      if (timer) clearTimeout(timer);
      timer = setTimeout(async res => {
        await that.add();
      }, 500)
    }
  },
  add: function () {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo')
    var creation_date = util.formatTime(new Date())
    wx.showLoading({
      title: '提交中',
    })
    let code = that.getRanNum();
    let numberCode = "";
    for (let e = 0; e < 10; e++) {
      numberCode += Math.floor(Math.random() * 10)
    }
    wx.cloud.callFunction({
      name: 'recordAdd',
      data: {
        collection: 'activity',
        addData: {
          creation_date: creation_date,
          creation_timestamp: Date.parse(creation_date.replace(/-/g, '/')) / 1000,
          title: that.data.title,
          content: that.data.content,
          start_date: that.data.startTime,
          start_timestamp: Date.parse(that.data.startTime.replace(/-/g, '/')) / 1000,
          end_date: that.data.endTime,
          end_timestamp: Date.parse(that.data.endTime.replace(/-/g, '/')) / 1000,
          act_code: code + numberCode,
          shop_code: userInfo.shop[userInfo.shop.length - 1].shop_code,
          lat: userInfo.shop[userInfo.shop.length - 1].lat,
          lon: userInfo.shop[userInfo.shop.length - 1].lon,
          _openid: userInfo._openid,
          type: 'reservation'
        }
      }
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      wx.showToast({
        title: '发布活动成功',
        icon: 'success',
        duration: 2000
      })
      setTimeout(res => {
        wx.navigateTo({
          url: '/pages/activityDetails/activityDetails',
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
  getRanNum() {
    var result = [];
    for (var i = 0; i < 2; i++) {
      var ranNum = Math.ceil(Math.random() * 25);
      //大写字母'A'的ASCII是65,A~Z的ASCII码就是65 + 0~25;然后调用String.fromCharCode()传入ASCII值返回相应的字符并push进数组里
      result.push(String.fromCharCode(65 + ranNum));
    }
    return result.join('');
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
  // onShareAppMessage: function () {

  // }
})