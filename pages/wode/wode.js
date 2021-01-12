var app = getApp();
var util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    userInfo: {
      type: 'driver',
      nickName: '用户名',
      avatarUrl: ''
    },
    carLight: [{
        id: 0,
        name: '是',
        checked: false,
      },
      {
        id: 1,
        name: '否',
        checked: false,
      },
    ],
    claim:[
      {
        id: 0,
        name: '产品设计',
        checked: false,
      },
      {
        id: 1,
        name: '功率射程',
        checked: false,
      },
      {
        id: 2,
        name: '温控散热',
        checked: false,
      },
      {
        id: 3,
        name: '性价比',
        checked: false,
      },
      {
        id: 4,
        name: '专车兼容',
        checked: false,
      },
      {
        id: 5,
        name: '售后服务',
        checked: false,
      },
    ],
    checkbox: [{
        id: 0,
        name: '行车记录仪',
        checked: false,
      }, {
        id: 1,
        name: '隐形车衣',
        checked: false,
      }, {
        id: 2,
        name: '360全景',
        checked: false,
      },
      {
        id: 3,
        name: '导航车机',
        checked: false,
      },
      {
        id: 4,
        name: '汽车音响',
        checked: false,
      },
      {
        id: 5,
        name: '汽车美容',
        checked: false,
      }
    ],
    userInfo: {
      type: 'driver',
      nickName: '用户名',
      avatarUrl: ''
    },
    newMsg: 0,
    prize: false,
    posterImg: [
      'https://img14.360buyimg.com/ddimg/jfs/t1/166688/37/1598/104678/5ff7cf5bEb402e7cf/f01242efb00089f2.png',
      'https://img14.360buyimg.com/ddimg/jfs/t1/166688/37/1598/104678/5ff7cf5bEb402e7cf/f01242efb00089f2.png',
      'https://img14.360buyimg.com/ddimg/jfs/t1/166688/37/1598/104678/5ff7cf5bEb402e7cf/f01242efb00089f2.png'
    ],
    cardCur: 0,
  },
  toMyCoupon() {
    wx.navigateTo({
      url: '/pages/myCoupon/myCoupon',
    })
  },
  toAddStoreInformation() {
    wx.navigateTo({
      url: '/pages/addStoreInformation/addStoreInformation',
    })
  },
  toCarAppointment() {
    wx.navigateTo({
      url: '/pages/carAppointment/carAppointment',
    })
  },
  toMyStore() {
    wx.navigateTo({
      url: '/pages/myStore/myStore',
    })
  },
  toAllstore() {
    wx.navigateTo({
      url: '/pages/allStore/allStore',
    })
  },
  toActivityDetails() {
    wx.navigateTo({
      url: '/pages/activityDetails/activityDetails?data='+'parse',
    })
  },
  toHelpAndFeedback() {
    wx.navigateTo({
      url: '/pages/helpAndFeedback/helpAndFeedback',
    })
  },
  toCommonProblem() {
    wx.navigateTo({
      url: '/pages/commonProblem/commonProblem',
    })
  },

  toMessageCenter() {
    if (!wx.getStorageSync('userInfo')) {
      this.selectComponent("#authorize").showModal();
    } else {
      wx.navigateTo({
        url: '/pages/messageCenter/messageCenter',
      })
    }
  },

  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },

  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },

  //弹窗
  showModal(e) {
    let that = this;
    let target = e.currentTarget.dataset.target;
    let ind = e.currentTarget.dataset.index;
    that.setData({
      waresInd: ind
    })
    console.log(that.data.waresInd)
    if (target === 'goGroupSuccess') {
      wx.showLoading({
        title: '加载中...',
      })
      setTimeout(function () {
        that.setData({
          modalName: target
        })
        wx.hideLoading({
          success: (res) => {},
        })
      }, 1000)

    } else {
      that.setData({
        modalName: target
      })
    }
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      transfer: false
    })
  },

  //车灯单选
  carLightsCheckbox(e) {
    let carLight = this.data.carLight;
    let ind = e.currentTarget.id;
    for (let i in carLight) carLight[i].checked = false
    carLight[ind].checked = true;
    this.setData({
      carLight
    })
  },

  claimCheckbox(e) {
    let claim = this.data.claim;
    let id = e.currentTarget.id;
    console.log(id)
    for (let i = 0; i < claim.length; ++i) {
      if (claim[i].id == id) {
        console.log(claim[i].id)
        claim[i].checked = !claim[i].checked;
        break
      }
    }
    this.setData({
      claim
    })
  },

  // 多选
  ChooseCheckbox(e) {
    let items = this.data.checkbox;
    let id = e.currentTarget.id;
    console.log(id)
    for (let i = 0; i < items.length; ++i) {
      if (items[i].id == id) {
        console.log(items[i].id)
        items[i].checked = !items[i].checked;
        break
      }
    }
    this.setData({
      checkbox: items
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
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
    if (wx.getStorageSync('userInfo')) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo
      })
      console.log(userInfo)
    }
    wx.removeStorageSync('prize')
    var _t = this
    switch (wx.getStorageSync('userInfo') !== '') {
      case true:
        wx.cloud.database().collection('message').where({
          _openid: app.globalData.openid,
          read: 'unread'
        }).count({
          success: function (res) {
            _t.setData({
              newMsg: res.total
            })
          }
        })
        if (!wx.getStorageSync('prize')) {
          wx.cloud.database().collection('coupon').where({
            _openid: app.globalData.openid,
            shop_code: 'all'
          }).get().then(res => {
            let data = res.data;
            if (data.length == 0) {
              _t.setData({
                prize: true
              })
            } else {
              wx.setStorageSync('prize', data)
            }
          })
        }
        break;
    }
  },

  toSign: function () {
    if (!wx.getStorageSync('userInfo')) {
      this.selectComponent("#authorize").showModal();
    }
  },
  getCoupon: function () {
    var that = this;
    let userInfo = wx.getStorageSync('userInfo')
    wx.showLoading({
      title: '领取中'
    })
    let code = '';
    for (let e = 0; e < 6; e++) {
      code += Math.floor(Math.random() * 10)
    }
    wx.cloud.callFunction({
      name: 'recordAdd',
      data: {
        collection: 'coupon',
        addData: {
          creation_date: util.formatTimes(new Date()),
          creation_timestamp: Date.parse(util.formatTimes(new Date()).replace(/-/g, '/')) / 1000,
          end_date: util.nextYear(new Date()),
          end_timestamp: Date.parse(util.nextYear(new Date()).replace(/-/g, '/')) / 1000,
          _openid: userInfo._openid,
          cou_code: code,
          act_id: '-1',
          user: userInfo.nickName,
          shop_code: 'all',
          shopping: {
            name: '全品类商品',
            price: '0',
            original_price: '100'
          },
          status: 'success'
        }
      }
    }).then(res => {
      wx.hideLoading()
      wx.showToast({
        title: '领取成功',
        icon: 'success',
        duration: 500
      })
      that.setData({
        modalName: null
      })
      let device = []
      for (let i = 0; i < that.data.checkbox.length; i++) {
        if (that.data.checkbox[i].checked == true) {
          device.push(that.data.checkbox[i].name)
        }
        if (i + 1 == that.data.checkbox.length) {
          wx.cloud.callFunction({
            name: 'recordAdd',
            data: {
              collection: 'device',
              addData: {
                creation_date: util.formatTimes(new Date()),
                creation_timestamp: Date.parse(util.formatTimes(new Date()).replace(/-/g, '/')) / 1000,
                _openid: userInfo._openid,
                user: userInfo.nickName,
                device: device
              }
            }
          }).then(res => {})
        }
      }
      that.setData({
        prize: false
      })
      wx.setStorageSync('prize', [{
        status: 'success',
        cou_code: code,
        act_id: '-1'
      }])
      wx.showModal({
        title: '成功领取100现金抵扣红包',
        content: '红包已经放进我的卡券里，是否前往查看',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../myCoupon/myCoupon',
            })
          }
        }
      })
    }).catch(error => {
      wx.hideLoading({
        success: (res) => {},
      })
      wx.showModal({
        showCancel: false,
        title: '系统繁忙，请稍后重试'
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.from)
      return {
        title: "大品牌，好未来！", //分享标题
        imageUrl: 'https://img10.360buyimg.com/ddimg/jfs/t1/148055/20/20623/109199/5fe94a22E2aeac6fb/f5ba90fc9d52fc06.png', //图片路径
        path: 'pages/index/index'
      }
    } else {
      return {
        title: "大品牌，好未来！", //标题
        imageUrl: 'https://img10.360buyimg.com/ddimg/jfs/t1/148055/20/20623/109199/5fe94a22E2aeac6fb/f5ba90fc9d52fc06.png', //图片路径
        path: '/page/index/index'
      }
    }
  }
})