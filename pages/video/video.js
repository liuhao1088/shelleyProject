// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList:[
      'https://fnck-20200914-1303154931.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/%E9%9B%AA%E8%8E%B1%E7%89%B9/%E9%9B%AA%E8%8E%B1%E7%89%B9%20R2.mp4?q-sign-algorithm=sha1&q-ak=AKIDHL7fPrFwXrtdX9SYLq75j5BxTeFbR3KK&q-sign-time=1605876497;10245790097&q-key-time=1605876497;10245790097&q-header-list=&q-url-param-list=&q-signature=d4d114103b4519e9b83920355c532a0aa5e483c8',
      'https://fnck-20200914-1303154931.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/%E9%9B%AA%E8%8E%B1%E7%89%B9/%E9%9B%AA%E8%8E%B1%E7%89%B9R1%204%20%281%29.mp4?q-sign-algorithm=sha1&q-ak=AKIDHL7fPrFwXrtdX9SYLq75j5BxTeFbR3KK&q-sign-time=1605876508;10245790108&q-key-time=1605876508;10245790108&q-header-list=&q-url-param-list=&q-signature=7277a423500f9c017a4b856e75b17a109f20f764',
      'https://fnck-20200914-1303154931.cos.ap-guangzhou.myqcloud.com/%E8%A7%86%E9%A2%91/%E9%9B%AA%E8%8E%B1%E7%89%B9/%E9%9B%AA%E8%8E%B1%E7%89%B9R2.mp4?q-sign-algorithm=sha1&q-ak=AKIDHL7fPrFwXrtdX9SYLq75j5BxTeFbR3KK&q-sign-time=1605876516;10245790116&q-key-time=1605876516;10245790116&q-header-list=&q-url-param-list=&q-signature=f57b8f025d0ec72a97b31f25cca74b19f61d7d3c'
    ]
  },

  handlePlay(event){
    let vid = event.currentTarget.id;
    //关闭上一个播放的视频
    this.vid !== vid && this.videoContext && this.videoContext.stop();
    this.vid = vid;
    //创建控制视频标签的实例对象
    this.videoContext = wx.createVideoContext(vid);
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