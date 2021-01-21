// pages/reservationActivity/reservationActivity.js
const util = require('../../utils/util');
let date = util.formatTime(new Date())
let timer;
let scode;
var id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: '2021-01-10 12:00',
    endTime: '2021-01-10 12:00',
    title: '',
    content: '从X月X日起，凡在活动期间内提前预约XX（门店名字）汽车维修/前灯改装并准时到达的车主，50元XX超市水果购物卡、汽车清洗养护、夏季雨刮液2瓶、壳牌机油1瓶，四重豪礼任选其一！',
    transmit: '',
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
      startTime: '请选择开始时间',
      endTime: '请选择截止时间'
    })
    var that = this;
    let userInfo=wx.getStorageSync('userInfo')
    scode=userInfo.shop[userInfo.shop.length - 1].shop_code;
    id=userInfo.shop[userInfo.shop.length - 1].shop_id;
    if(options.parse){
      scode='all'
      id='all'
    }
    if (options.data) {
      let data = JSON.parse(options.data)
      wx.setNavigationBarTitle({
        title: '编辑预约活动'
      })
      that.setData({
        transmit: data,
        title: data.title,
        startTime: data.start_date,
        endTime: data.end_date,
        content: data.content
      })
    }
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
    let startTime = this.data.startTime;//开始时间
    let endTime = this.data.endTime;//结束时间
    var oDate1 = new Date(date);
    var oDate2 = new Date(startTime);
    var oDate3 = new Date(endTime);
    console.log("当前时间："+oDate1.getTime(),"到店时间："+oDate2.getTime(),"结束时间："+oDate3.getTime());
    if (!this.data.title) {
      wx.showToast({
        title: '请输入活动标题',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    
    if (this.data.startTime === '请选择开始时间') {
      wx.showToast({
        title: '请选择开始时间',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (this.data.endTime === '请选择截止时间') {
      wx.showToast({
        title: '请选择截止时间',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if (oDate1.getTime() >= oDate2.getTime()) {
      wx.showToast({
        title: '时间已过，请重新选择开始时间',
        icon: 'none'
      })
      return ;
    } 
    if (oDate1.getTime() >= oDate3.getTime()) {
      wx.showToast({
        title: '时间已过，请重新选择截止时间',
        icon: 'none'
      })
      return ;
    } 

    if (oDate2.getTime() >= oDate3.getTime()) {
      wx.showToast({
        title: '截止时间不能小于开始时间',
        icon: 'none'
      })
      return ;
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
      if (that.data.transmit == '') {
        wx.showLoading({
          title: '提交中',
        })
        if (timer) clearTimeout(timer);
        timer = setTimeout(async res => {
          wx.setStorageSync('refresh', 'has')
          await that.add();
        }, 500)
      } else {
        if (timer) clearTimeout(timer);
        timer = setTimeout(async res => {
          wx.setStorageSync('refresh', 'has')
          await that.update();
        }, 500)
      }

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
          shop_code: scode,
          shop_id: id,
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
        wx.navigateBack({
          delta: 2,
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
  update: function () {
    var that = this;
    wx.showLoading({
      title: '保存中',
    })
    wx.cloud.callFunction({
      name: 'recordUpdate',
      data: {
        collection: 'activity',
        where: {
          _id: that.data.transmit._id
        },
        updateData: {
          title: that.data.title,
          start_date: that.data.startTime,
          start_timestamp: Date.parse(that.data.startTime.replace(/-/g, '/')) / 1000,
          end_date: that.data.endTime,
          end_timestamp: Date.parse(that.data.endTime.replace(/-/g, '/')) / 1000,
          content: that.data.content
        }
      }
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      wx.showToast({
        title: '编辑活动成功',
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