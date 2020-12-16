// pages/wode/wode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: [
      'https://img12.360buyimg.com/ddimg/jfs/t1/148705/14/15342/31361/5fbb2538E10f5782c/01b82dfee5771477.png',
      'https://img11.360buyimg.com/ddimg/jfs/t1/149801/9/15214/84373/5fb77f5fE6703b3e3/cfc63e812c95bd6a.png',
      'https://img11.360buyimg.com/ddimg/jfs/t1/131154/14/16544/101703/5fb77f7bEf9dae1d6/a2e338acd1913cb2.png',
      'https://img11.360buyimg.com/ddimg/jfs/t1/122546/28/19388/99801/5fb77f8aE5bcec9c5/dd12a83a33c44745.png',
      'https://img10.360buyimg.com/ddimg/jfs/t1/153564/6/6918/31485/5fbb2566Ef69e10fb/37895c04bd3f96b7.png',
      'https://img12.360buyimg.com/ddimg/jfs/t1/121051/8/19558/32587/5fbb2550Ea70b561f/ed4f4616ae1b543b.png'
    ],
    modalName:0
  },
  toVideo() {
    wx.navigateTo({
      url: '/pages/video/video',
    })
  },
  toSubnav(event) {
    let id = event.currentTarget.id;
    if (id === '0') {
      console.log(id);
      wx.navigateTo({
        url: '/pages/rOne/rOne',
      })
    } else if (id === '1') {
      console.log(id);
      wx.navigateTo({
        url: '/pages/rTwo/rTwo',
      })
    } else if (id === '2') {
      console.log(id);
      wx.navigateTo({
        url: '/pages/bTwo/bTwo',
      })
    } else if (id === '3') {
      console.log(id);
      wx.navigateTo({
        url: '/pages/bThree/bThree',
      })
    } else if (id === '4') {
      console.log(id);
      wx.navigateTo({
        url: '/pages/tThree/tThree',
      })
    } else {
      console.log(id);
      wx.navigateTo({
        url: '/pages/sThree/sThree',
      })
    }

  },

  toMyCoupon(event){
    wx.navigateTo({
      url: '/pages/myCoupon/myCoupon',
    })
  },

  toReserveStore(event){
    wx.navigateTo({
      url: '/pages/reserveStore/reserveStore',
    })
  },
  
  toMyStore(event){
    wx.navigateTo({
      url: '/pages/myStore/myStore',
    })
  },

  hideModal(e) {
    this.setData({
      modalName: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.showShareMenu({

      withShareTicket: true,

      menus: ['shareAppMessage', 'shareTimeline']

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