// pages/myStore/myStore.js
var userInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeImg: '',
    list:[],
    animation:false
  },

  toStoreInformation(event) {
    let data = JSON.stringify(wx.getStorageSync('userInfo'))
    wx.navigateTo({
      url: '/pages/storeInformation/storeInformation?data=' + data,
    })
  },
  toActivityDetails(event) {
    wx.navigateTo({
      url: '/pages/activityDetails/activityDetails',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    this.load()
    setTimeout(()=>{
      this.setData({animation:true})
    },500)
    console.log(userInfo)
    let code = userInfo.shop[userInfo.shop.length - 1].shop_code;
    let storeImg = userInfo.shop[userInfo.shop.length - 1].shop_img;
    switch (JSON.stringify(code).length) {
      case 1:
        code = '00' + JSON.stringify(code)
        break;
      case 2:
        code = '0' + JSON.stringify(code)
        break;
    }

    this.setData({
      storeImg
    })
    wx.setNavigationBarTitle({
      title: "我的门店码：" + code
    })
    

  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
   
  load:function(){
    var that=this;
    wx.cloud.database().collection('live').orderBy('creation_date','desc').skip(0).limit(5).get().then(res=>{
      let data=res.data;
      wx.getSystemInfo({
        success: function (res) {
          let width=res.windowWidth*0.9*0.8;//内容宽度
          let cnlen=(res.windowWidth/750)*23//每个中文的长度,单位px
          for(let i of data){ 
            let contlen=that.gblen(i.content)//内容总长度，1个中文2长度
            let line=((contlen/2)*cnlen)/width//内容行数
            i.line=Math.ceil(line);
            console.log(i.line)
            that.setData({list:data})
          }
        }
      });
      that.setData({list:data})
    })
  },
  gblen(str) {
    if (str == null) return 0;
    if (typeof str != "string"){
      str += "";
    }
    return str.replace(/[^\x00-\xff]/g,"01").length;
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