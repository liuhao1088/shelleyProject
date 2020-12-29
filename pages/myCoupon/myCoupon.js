// pages/myCoupon/myCoupon.js
var skip=0;
var util=require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],stamp:'',code:'',cou_ind:0,cou_checked:false,cou_id:''
  },
  showModal(e) {
    let ind=e.currentTarget.dataset.index;
    this.setData({
      modalName: e.currentTarget.dataset.target,
      cou_ind:ind
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
  inputCode:function(e){
    this.setData({code:e.detail.value})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    
  },
  submit:function(){
    var that=this;
    wx.showLoading({
      title: '加载中',
    })
    let shop_code=that.data.list[that.data.cou_ind].shop_code;
    if(that.data.code==shop_code||shop_code=='all'){
      wx.cloud.callFunction({
        name:'recordUpdate',
        data:{
          collection:'coupon',
          where:{
            _id:that.data.list[that.data.cou_ind]._id
          },
          updateData:{
            status:'complete'
          }
        }
      }).then(res=>{
        console.log(res)
        wx.hideLoading({
          success: (res) => {},
        })
        if(res.result.stats.updated==1){
          let list=that.data.list;
          list[that.data.cou_ind].status='complete'
          list[that.data.cou_ind].usable=false;
          that.setData({
            list:list,
            modalName:null
          })
          wx.showToast({
            title: '使用成功',
            icon:'success',
            duration:1500
          })
        }else{
          wx.showModal({
            title:'网络繁忙，请稍后重试',
            showCancel:false
          })
        }
        
      }).catch(error=>{
        wx.showModal({
          title:'网络繁忙，请稍后重试',
          showCancel:false
        })
      })
      if(that.data.cou_checked==true){
        wx.cloud.callFunction({
          name:'recordUpdate',
          data:{
            collection:'coupon',
            where:{
              cou_code:that.data.cou_id
            },
            updateData:{
              status:'complete'
            }
          }
        }).then(res=>{
          console.log(res)
          wx.hideLoading({
            success: (res) => {},
          })
          if(res.result.stats.updated==1){
            let list=that.data.list;
            var index = list.findIndex(function(item) {
              return item.shop_code == "all";
            });
            list[index].status='complete'
            list[index].usable=false;
            that.setData({
              list:list,cou_checked:false
            })
          }else{
          }
          
        }).catch(error=>{
        })
      }
    }else{
      wx.showToast({
        title:'门店码错误',
        icon:'none',
        duration:2000
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
      let stamp=Date.parse(util.formatTimes(new Date()).replace(/-/g, '/')) / 1000;
      that.setData({stamp:stamp})
      for(let i=0;i<data.length;i++){
        data[i].usable=true;
        if(data[i].shop.length>0){
          if(data[i].status=='waiting'){
            if(stamp>=data[i].creation_timestamp+parseInt(data[i].shopping.time)*60){
              data[i].usable=false;//拼团失败
            }
            data[i].surplus=parseInt((data[i].creation_timestamp+parseInt(data[i].shopping.time)*60-stamp)/60)
          }
          if(stamp>=data[i].act[0].end_timestamp){
            data[i].usable=false;//过期
          }
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
    skip=0;
    this.loadData();
    var that = this;
    if(wx.getStorageSync('userInfo')){
      let userInfo=wx.getStorageSync('userInfo')
      let data=wx.getStorageSync('prize');
      if(data[0].status){
        if(data[0].status=='complete'){
          that.setData({cou_checked:false})
        }else{
          that.setData({cou_checked:true,cou_id:data[0].cou_code})
        }
      }
      if(data.length==0){
        that.setData({cou_checked:false})
      }
      
    }else{
      wx.showToast({
        title: '暂无卡券',
        icon:'none',
        duration:10000000
      })
    }
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
        imageUrl: 'https://img13.360buyimg.com/ddimg/jfs/t1/160040/27/61/289416/5fe99874E75804776/891b1b08109afc6d.png', //图片路径
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