// pages/groupActivities/groupActivities.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: '2020-12-17 11:32',//活动开始时间
    endTime: '2020-12-17 11:32',//活动截止时间
    productList:[
      {
        "name": '',
        "price": '',
        "people":'',
        "time":'时间',
        "showView":false
      }
    ],//活动商品
    
   
  },
  //获取活动开始时间
  changeStartTime(e) {
    console.log(e.detail.startTime)
    this.setData({
      startTime: e.detail.startTime
    })
  },

  // 获取活动截止时间
  changeEndTime(e) {
    console.log(e.detail.endTime)
    this.setData({
      endTime: e.detail.endTime
    })
  },

  //获取分钟
  timeChange(e) {
    var index = e.currentTarget.dataset.idx; //获取当前索引
    console.log(index)
    this.data.productList[index].time = e.detail.value
  },

  //添加活动商品
  onAdd(e){
    console.log(e)
    let productList = this.data.productList;
    let index = e.currentTarget.dataset.idx;
    console.log(index)
    let newData = {
      "name": '',
      "price": '',
      "people":'',
      "time":'时间',
      "showView":false
    };
    if (productList.length >= 6) {
      wx.showToast({
        title: '最多添加6个商品',
        icon: 'none',
        duration: 2000
      })
       return;
     }
    productList.push(newData);
    console.log(this.data.productList[index].showView)
    this.data.productList[index].showView  =  !this.data.productList[index].showView;
    console.log(this.data.productList[index].showView)
    this.setData({
      productList,
    })
  },

  //获取input的值
  bindChanguser(e){
    var index = e.currentTarget.dataset.idx; //获取当前索引
    var type = e.currentTarget.id;//状态
    console.log(index)
    this.data.productList[index][type] = e.detail.value
    console.log(this.data.productList[index][type])
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let date =  uilt.formatTime(new Date());
    // this.setData({
    //  startTime:date,
    //  endTime:date
    // })
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