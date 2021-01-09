// pages/manage/feedback/feedback.js
var skip;
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
    wx.setNavigationBarTitle({
      title: '意见反馈',
    })
    skip=0;
    this.moreData()
  },
  
  moreData:function(){
    var that=this;
    wx.cloud.database().collection('feedback').orderBy('creation_date','desc').skip(skip).limit(20).get().then(res=>{
      let data=that.data.list.concat(res.data)
      console.log(res.data)
      data.forEach((i) => {
        i.checkup=that.checkphone(i.fb_contact)
      });
      if(res.data.length==0){
        wx.showToast({
          title: '没有更多反馈',
          icon:'none',
          duration:1500
        })
      }
      that.setData({
        list:data
      })
      if(that.data.list.length==0){
        wx.showToast({
          title: '暂无反馈',
          icon:'none',
          duration:100000000
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  copy:function(e){
    var that=this;
    var ind=e.currentTarget.dataset.index;
    wx.setClipboardData({data:that.data.list[ind].fb_contact})
  },

  callphone:function(e){
    var ind=e.currentTarget.dataset.index;
    wx.makePhoneCall({
      phoneNumber: this.data.list[ind].fb_contact,
    })
  },

  preview:function(e){
    var ind=e.currentTarget.dataset.index;
    wx.previewImage({
      urls: this.data.list[ind].fb_img,
    })
  },
  
  checkphone(data){
    var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    var myreg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
    //console.log(getRegExp("x", "img"))
    //var mobile=getRegExp('^[1][3,4,5,7,8][0-9]{9}$','g')
    //var myreg=getRegExp('^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$','g')
    //.exec(data)
    //data.replace(mobile,'$&,')
    if(mobile.exec(data)){
      return true
    }else if(myreg.exec(data)){
      return true
    }else{
      return false
    }
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
    skip=skip+20;
    this.moreData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})