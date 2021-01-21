// pages/messageCenter/messageCenter.js
var app = getApp()
var util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ListTouchStart: 0,
    ListTouchDirection: '',
    modalName: '',
    list: [],
    ind: 0,
    hiddenFlag:true,
    display:'none'
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
    console.log(this.data.ListTouchDirection)
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },

  showModal(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      name: e.currentTarget.dataset.name,
      ind: index,
    })
    let list = this.data.list;
    switch (list[index].read) {
      case 'unread':
        list[index].read = 'read';
        this.setData({
          list: list
        })
        util.update('message', {
          _id: list[index]._id
        }, {
          read: 'read'
        })
        break;
    }
  },
  hideModal(e) {
    this.setData({
      name: null,
    })
  },

  copyBtn(e) {
    var that = this;
    var target = e.currentTarget.dataset.target;
    if (target === 'video') {
      that.copy("1111");
    } else {
      that.copy("222");
    }
  },
  // 复制
  copy(date) {
    wx.setClipboardData({
      data: date, //一定要字符串
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data)
          }
        })
      }
    })
  },

  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.list[this.data.ind].shop[0].phone,
    })
  },
  openLocation() {
    wx.openLocation({
      latitude: this.data.list[this.data.ind].shop[0].lat,
      longitude: this.data.list[this.data.ind].shop[0].lon,
      name:this.data.list[this.data.ind].shop[0].address_name,
      address:this.data.list[this.data.ind].shop[0].address
    })
  },

  delete: function (e) {
    var that = this;
    var ind = e.currentTarget.dataset.index;
    wx.showModal({
      title: '删除该消息',
      success: function (res) {
        //console.log(res)
        if (res.confirm) {
          let list = that.data.list;
          wx.setStorageSync('del', list[ind]._id)
          list.splice(ind, 1)
          that.setData({
            list: list
          })
          let i = wx.getStorageSync('del')
          console.log(i)
          wx.cloud.callFunction({
            name: 'recordDelete',
            data: {
              collection: 'message',
              where: {
                _id: i
              }
            }
          }).then(res => {
            wx.removeStorageSync('del')
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (wx.getStorageSync('userInfo')) {
      wx.showLoading({
        title: '加载中',
      })
      var userInfo=wx.getStorageSync('userInfo')
      wx.cloud.callFunction({
        name: 'multQuery',
        data: {
          collection: 'message',
          match: {
            _openid: userInfo._openid
          },
          or: [{}],
          and: [{}],
          lookup: {
            from: 'shop',
            localField: 'shop_code',
            foreignField: 'shop_code',
            as: 'shop',
          },
          lookup2: {
            from: 'user',
            localField: '_openid',
            foreignField: '_openid',
            as: 'user',
          },
          sort: {
            creation_date: -1
          },
          skip: 0,
          limit: 100
        }
      }).then(res => {
        console.log(res)
        wx.hideLoading({
          success: (res) => {},
        })
        let data = res.result.list;
        if (data.length == 0) {
          that.setData({
            hiddenFlag:false
          })
        }else{
          that.setData({
            display:'block'
          })
        }
        that.setData({
          list: data
        })
      })
    }
  },

  allread: function () {
    if (wx.getStorageSync('userInfo')) {
      console.log(app.globalData.openid)
      let list = this.data.list;
      for (let i of list) {
        i.read = 'read';
        this.setData({
          list
        })
      }
      util.update('message', {
        _openid: app.globalData.openid
      }, {
        read: 'read'
      })
    }
  },
  subscribe: function (e) {
    var ind = e.currentTarget.dataset.index;
    let tpid;
    switch (this.data.list[ind].type) {
      case 're':
        if (this.data.list[ind].res == 'success') {
          tpid = ['-m92htbt5V0SlqRwZaMZAy9l3mv3CNseLM-yDKlRG5g']
        } else {
          tpid = ['SVnl7juS4DJeu57ZvCHsFtWrp3y1bfTT7_rbv36mXY0']
        }
        break;
      case 'check':
        tpid = ['pvZ2jnDjUwfpT2bpby2SxP5P1tcl3LXcn9RfOc8ibuI']
        break;
      case 'myre':
        tpid = ['-m92htbt5V0SlqRwZaMZAy9l3mv3CNseLM-yDKlRG5g', 'SVnl7juS4DJeu57ZvCHsFtWrp3y1bfTT7_rbv36mXY0', 'GN7JfS1q9N7eqdmvOxcFY6kjBBrUsnyRc6UGr58LAwg']
        break;
    }
    wx.requestSubscribeMessage({
      tmplIds: tpid,
      success(res) {
        console.log(res)
        if (JSON.stringify(res).indexOf('accept') !== -1) {
          wx.showToast({
            title: '订阅了消息通知',
            icon: 'success',
            duration: 2000
          })
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})