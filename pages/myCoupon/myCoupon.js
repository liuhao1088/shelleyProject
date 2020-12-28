// pages/myCoupon/myCoupon.js
var skip=0;
var util=require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],stamp:''
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  toCouponRules() {
    wx.navigateTo({
      url: '/pages/couponRules/couponRules',
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(wx.getStorageSync('userInfo')){
      that.loadData();
    }else{
      wx.showToast({
        title: '暂无卡券',
        icon:'none',
        duration:10000000
      })
    }
    
  },
  loadData:function(){
    var that=this;
    let userInfo=wx.getStorageSync('userInfo')
    wx.cloud.callFunction({
      name: 'multQuery',
      data: {
        collection: 'coupon',
        match: {
          _openid: userInfo._openid
        },
        or: [{}],
        and: [{}],
        lookup: {
          from: 'activity',
          localField: 'act_id',
          foreignField: '_id',
          as: 'act',
        },
        lookup2: {
          from: 'shop',
          localField: 'shop_id',
          foreignField: '_id',
          as: 'shop',
        },
        sort: {
          creation_date: -1
        },
        skip: skip,
        limit: 5
      }
    }).then(res => {
      let data=res.result.list;
      if(data.length==0){
        wx.showToast({
          title: '暂无更多卡券',
          icon:'none'
        })
      }
      console.log(res)
      let stamp=Date.parse(util.formatTimes(new Date()).replace(/-/g, '/')) / 1000;
      that.setData({stamp:stamp})
      for(let i=0;i<data.length;i++){
        data[i].usable=true;
        if(data[i].status=='waiting'){
          if(stamp>=data[i].creation_timestamp+parseInt(data[i].shopping.time)*60){
            data[i].usable=false;//拼团失败
          }
          data[i].surplus=parseInt((data[i].creation_timestamp+parseInt(data[i].shopping.time)*60-stamp)/60)
        }
        if(stamp>=data[i].act[0].end_timestamp){
          data[i].usable=false;//过期
        }
        if(data[i].status=='complete'){
          data[i].usable=false;//已使用
        }
        if(i+1==data.length){
          let alldata=that.data.list.concat(data)
          that.setData({list:alldata})
        }
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
    skip=skip+5;
    this.loadData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that=this;
    var ind=res.target.dataset.index;
    if (res.from === 'button') {
      console.log(res.from,res,that.data.list[ind]._id,that.data.list[ind].cou_code,that.data.list[ind].act[0].end_timestamp)
      return {
        title: "【仅剩1个名额】我领了100元拼团券，快来助我成团激活~", //分享标题
        imageUrl: 'https://img13.360buyimg.com/ddimg/jfs/t1/121210/17/18389/166336/5faca14cE7949307a/1da2d6b96122e01d.jpg', //图片路径
        path: 'pages/groupSpecial/groupSpecial?act_id='+that.data.list[ind].act_id +'&cou_code='+that.data.list[ind].cou_code+'&end_timestamp='+that.data.list[ind].act[0].end_timestamp
      }
    } else {
      return {
        title: "雪莱特智能LED车灯", //标题
        imageUrl: 'https://img10.360buyimg.com/ddimg/jfs/t1/148055/20/20623/109199/5fe94a22E2aeac6fb/f5ba90fc9d52fc06.png', //图片路径
        path: '/page/groupSpecial/groupSpecial'
      }
    }
  }

})