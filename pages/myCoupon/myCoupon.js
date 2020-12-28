// pages/myCoupon/myCoupon.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  toCouponRules(){
    wx.navigateTo({
      url: '/pages/couponRules/couponRules',
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let userInfo=wx.getStorageSync('userInfo')
    wx.cloud.callFunction({
      name: 'multQuery',
      data: {
        collection: 'coupon',
        match: {_openid:userInfo._openid},
        or: [{}],
        and: [{}],
        lookup: {
          from: 'activity',
          localField: 'act_id',
          foreignField: '_id',
          as: 'act',
        },
        lookup2: {
          from: 'shop',
          localField: 'shop_id',
          foreignField: '_id',
          as: 'shop',
        },
        sort: {
          creation_date: -1
        },
        skip: 0,
        limit: 10
      }
    }).then(res => {
      let data=res.result.list[0];
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      return {
        title: "【仅剩1个名额】我领了100元拼团券，快来助我成团激活~", //分享标题
        imageUrl: '', //图片路径
        path: '/page/groupSpecial/groupSpecial'
      }
    } else {
      return {
        title: "雪莱特智能LED车灯", //标题
        imageUrl: 'https://img10.360buyimg.com/ddimg/jfs/t1/148055/20/20623/109199/5fe94a22E2aeac6fb/f5ba90fc9d52fc06.png', //图片路径
        path: '/page/groupSpecial/groupSpecial'
      }
    }



  }
})