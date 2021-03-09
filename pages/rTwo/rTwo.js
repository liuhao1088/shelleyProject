// pages/rTwo/rTwo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {
      url:'https://img12.360buyimg.com/ddimg/jfs/t1/136326/26/16919/256834/5fb7b083E740f75e6/a23838cbc7fa4403.jpg',
      urlTwo:'https://img11.360buyimg.com/ddimg/jfs/t1/127774/28/19471/416225/5fbb26c1Eb8d3d03e/2eb9d7cae174d9b7.jpg',
      imgUrl:'https://img14.360buyimg.com/ddimg/jfs/t1/129869/16/16886/195207/5fbb2a0fE36f97702/5e59e714a36e1980.jpg'
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
    return {
      title: "雪莱特智能LED车灯", //标题
      imageUrl: 'https://img10.360buyimg.com/ddimg/jfs/t1/148055/20/20623/109199/5fe94a22E2aeac6fb/f5ba90fc9d52fc06.png', //图片路径
      path: '/pages/home/home'
    }
   }
})