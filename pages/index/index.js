// pages/wode/wode.js
var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    carLight: [{
        id: 0,
        name: '是',
        checked: true,
      },
      {
        id: 1,
        name: '否',
        checked: false,
      },
    ],
    claim: [{
        id: 0,
        name: '产品设计',
        checked: true,
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
        checked: true,
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
    scrollNum: false,
  },
  togroupSpecial() {
    wx.navigateTo({
      url: '/pages/groupSpecial/groupSpecial',
    })
  },

  //弹窗
  hideModal(e) {
    let target = e.currentTarget.dataset.target;
    this.setData({
      modalName: target
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
  // 要求多选
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

  // 服务多选
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

  // 滚动
  questionScroll(e) {
    this.setData({
      scrollNum: true
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          if (!wx.getStorageSync('userInfo')) {
            this.selectComponent("#authorize").showModal();
          }
        } else {
          //打开授权登录页
          this.selectComponent("#authorize").showModal();
        }
      }
    })
    util.nearby();
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
    var that = this;
    if (wx.getStorageSync('userInfo')) {
      let userInfo = wx.getStorageSync('userInfo')
      wx.cloud.callFunction({
        name: 'multQuery',
        data: {
          collection: 'user',
          match: {
            _openid: userInfo._openid
          },
          or: [{}],
          and: [{}],
          lookup: {
            from: 'shop',
            localField: '_openid',
            foreignField: '_openid',
            as: 'shop',
          },
          lookup2: {
            from: 'coupon',
            localField: '_openid',
            foreignField: '_openid',
            as: 'coupon',
          },
          sort: {
            creation_date: -1
          },
          skip: 0,
          limit: 1
        }
      }).then(res => {
        let user = res.result.list[0];
        console.log(user)
        wx.setStorageSync('userInfo', user)
      })
    }
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