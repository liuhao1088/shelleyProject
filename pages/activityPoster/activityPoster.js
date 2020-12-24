// pages/activityPoster/activityPoster.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowclientX: ""
  },

  togroupSpecial(){
    wx.navigateTo({
      url: '/pages/groupSpecial/groupSpecial',
    })
  },

  // 获取手指点击的坐标
  touchstart(e) {
		console.log(e)
		this.setData({
			nowclientX: e.changedTouches[0].clientX
		})
  },
   // 获取手指的坐标
	touchend(e) {
		let nowclientX = this.data.nowclientX;
		let clientX = e.changedTouches[0].clientX;
		if (clientX > nowclientX) {
			console.log("向右滑动")
		} else {
      console.log("向左滑动")
      wx.navigateTo({
        url: '/pages/index/index',
      })
		}
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