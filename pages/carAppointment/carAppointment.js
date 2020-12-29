// pages/carAppointment/carAppointment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    let userInfo=wx.getStorageSync('userInfo')
    wx.cloud.database().collection('reservation').where({shop_code:userInfo.shop[userInfo.shop.length-1].shop_code}).get().then(res=>{
      let data=res.data;
      for(let i in data){
        data[i].label=data[i].shopping.join(',')
        that.setData({list:data})
      }
      if(data.length==0){
        wx.showToast({
          title: '暂无预约',
          icon:'none',
          duration:10000000
        })
      }
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
  // onShareAppMessage: function () {

  // }
})