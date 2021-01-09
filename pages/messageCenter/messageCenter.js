// pages/messageCenter/messageCenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ListTouchStart:0,
    ListTouchDirection:'',
    modalName:'',
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
    if (this.data.ListTouchDirection =='left'){
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
    this.setData({
      name: e.currentTarget.dataset.name
    })
  },
  hideModal(e) {
    this.setData({
      name: null,
    })
  },

  copyBtn(e){
    var that = this;
    var target = e.currentTarget.dataset.target;
    if(target === 'video'){
      that.copy("1111");
    }else{
      that.copy("222");
    }
  },
  // 复制
  copy(date){
    wx.setClipboardData({
      data:date,//一定要字符串
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data)
          }
        })
      }
    })
  },

  callPhone(){
    wx.makePhoneCall({
      phoneNumber: '4009988078',
    })
  },
  addressBtn(){
    wx.openLocation({
      latitude: 43.86,
      longitude: 10.40,
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