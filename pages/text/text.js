// pages/text/text.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [
      {
        "name": '',
        "user": ''
      }
    ]
  },
  onAddPhone: function () {
    var lists = this.data.lists;
    var newData = {
      "name": '',
      "user": ''
    };
    if (lists.length >= 3) {
      console.log('最多3个')
       return;
     }
    lists.push(newData);
    this.setData({
      lists: lists,
    })
  },
  delList: function (e) {
    var nowidx = e.currentTarget.dataset.idx; //当前索引
    console.log(nowidx)
    var lists = this.data.lists;
    lists.splice(nowidx, 1);
    this.setData({
      lists: lists,
    })
  },
  bindPhoneDataChangname: function (e) {
    var nowIdx = e.currentTarget.dataset.idx; //获取当前索引
    this.data.lists[nowIdx].name = e.detail.value
    console.log(this.data.lists[nowIdx].name)

  },
  bindPhoneDataChanguser: function (e) {
    var nowIdx = e.currentTarget.dataset.idx; //获取当前索引
    this.data.lists[nowIdx].user = e.detail.value
    console.log(this.data.lists[nowIdx].user)
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