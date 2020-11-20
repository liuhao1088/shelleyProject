// pages/wode/wode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:[
      'https://img12.360buyimg.com/ddimg/jfs/t1/125749/18/18992/88955/5fb77bf7Ef28aef02/9969721a65f206f0.png',
      'https://img11.360buyimg.com/ddimg/jfs/t1/149801/9/15214/84373/5fb77f5fE6703b3e3/cfc63e812c95bd6a.png',
      'https://img11.360buyimg.com/ddimg/jfs/t1/131154/14/16544/101703/5fb77f7bEf9dae1d6/a2e338acd1913cb2.png',
      'https://img11.360buyimg.com/ddimg/jfs/t1/122546/28/19388/99801/5fb77f8aE5bcec9c5/dd12a83a33c44745.png',
      'https://img14.360buyimg.com/ddimg/jfs/t1/145889/37/14730/88666/5fb77fa0Eddfcea31/7132ccdce4f86f6d.png',
      'https://img12.360buyimg.com/ddimg/jfs/t1/121576/23/19358/91213/5fb77fafEddf3b1e2/56368d754af746aa.png'
    ],
    item:{
      imgUrl:'https://img13.360buyimg.com/ddimg/jfs/t1/137890/36/15087/195882/5fb7784cEea2d2e2b/b89f57235b0f4d83.jpg'
    }
  },
  toSubnav(event){
    let id = event.currentTarget.id;
    if(id === '0'){
      console.log(id);
      wx.navigateTo({
        url: '/pages/rOne/rOne',
      })
    }else if(id === '1'){
      console.log(id);
      wx.navigateTo({
        url: '/pages/rTwo/rTwo',
      })
    }
    else if(id === '2'){
      console.log(id);
      wx.navigateTo({
        url: '/pages/bTwo/bTwo',
      })
    }
    else if(id === '3'){
      console.log(id);
      wx.navigateTo({
        url: '/pages/bThree/bThree',
      })
    }
    else if(id === '4'){
      console.log(id);
      wx.navigateTo({
        url: '/pages/tThree/tThree',
      })
    }
    else{
      console.log(id);
      wx.navigateTo({
        url: '/pages/sThree/sThree',
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
    wx.showShareMenu({

      withShareTicket:true,
      
      menus:['shareAppMessage','shareTimeline']
      
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