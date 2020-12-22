// pages/storeAppointment/storeAppointment.js
var util=require('../../utils/util.js')
var timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: '2020-12-17 11:32',
    checkbox: [{
      value: 0,
      name: '如影系列-R1',
      checked: false,
    }, {
      value: 1,
      name: '如影系列-R2',
      checked: false,
    }, {
      value: 2,
      name: '斑马系列-B2',
      checked: false,
    }, {
      value: 3,
      name: '斑马系列-B3',
      checked: false,
    }, {
      value: 4,
      name: '双色系列-S3',
      checked: false,
    }, {
      value: 5,
      name: '猎豹系列-T3',
      checked: false,
    }],
    nameList:['请选择想要体验的商品，可多选'],
    data:'',firstLoading:true,isShow:false,
    reservation:''
  },
  changeStartTime(e){
    this.setData({ startTime: e.detail.value})
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    let nameList = [];
    let items = this.data.checkbox;
    for (let i = 0;i < items.length;i++) {
      if(items[i].checked == true){
        nameList.push(items[i].name);
      }
    }
    if(nameList == ''){
      nameList = ['请选择想要体验的商品，可多选'] 
    }else{
      this.setData({isShow:true})
    }
    this.setData({
      modalName: null,
      nameList
    })
    if(wx.getStorageSync('phone')){
      this.setData({isShow:false})
    }
    console.log(nameList)
  },
  ChooseCheckbox(e) {
   
    let items = this.data.checkbox;
    let values = e.currentTarget.dataset.value;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value == values) {
        items[i].checked = !items[i].checked;
        break
      }
    }
    this.setData({
      checkbox: items,
    })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.data){
      let data=JSON.parse(options.data)
      console.log(data)
      if(data.reservation.length!==0){
        this.setData({reservation:'already'})
      }
      this.setData({data:data})
    }
    this.setData({startTime:util.formatTime(new Date())})
    wx.cloud.callFunction({
      name:'login'
    }).then(res=>console.log(res))
  },
  openLocation:function(){
    var that=this;
    wx.openLocation({
      latitude: that.data.data.shop[0].lat,
      longitude: that.data.data.shop[0].lon,
    })
  },
  getPhoneNumber:function(e){
    var that=this;
    console.log(e)
    if(e.detail.errMsg=="getPhoneNumber:ok"){
      wx.showLoading({
        title: '授权中',
      })
      wx.cloud.callFunction({
        name:'decode',
        data: {
          weRunData: wx.cloud.CloudID(e.detail.cloudID),
        }
      }).then(res=>{
        that.setData({
          phone: res.result,
        })
        let phone=res.result;
        if(!wx.getStorageSync('phone')){
          wx.setStorageSync('phone', res.result)
          wx.cloud.database().collection('user').where({
            _openid:wx.getStorageSync('userInfo')._openid
          }).get().then(res=>{
            console.log(res)
            if(!res.data[0].phone){
              wx.cloud.callFunction({
                name:'recordUpdate',
                data:{
                  collection:'user',
                  where:{_openid:wx.getStorageSync('userInfo')._openid},
                  updateData:{phone:phone}
                }
              }).then(res=>{
                console.log(res)
              })
            }
          })
        }
        let userInfo=wx.getStorageSync('userInfo')
        userInfo.phone=phone;
        wx.setStorageSync('userInfo', userInfo)
        wx.hideLoading()
        wx.showToast({
          title: '授权成功',
          icon:'success'
        })
        if (timer) clearTimeout(timer);
        timer= setTimeout(async res=>{
          that.add(phone,userInfo);
        },500)
      }).catch(error=>{
        console.log(error);
        wx.hideLoading()
        wx.showToast({
          title: '授权失败',
          icon:'none'
        })
      })
      
    }
  },
  async submit(){
    var that=this;
    console.log(that.data.nameList)
    if(that.data.nameList[0]=="请选择想要体验的商品，可多选"){
      wx.showToast({
        title: '请选择商品',
        icon:'none'
      })
    } else {
      if (timer) clearTimeout(timer);
      timer= setTimeout(async res=>{
      let phone=wx.getStorageSync('phone')
      let userInfo=wx.getStorageSync('userInfo')
        that.add(phone,userInfo);
      },500)
    }
  },
  add(phone,userInfo){
    var that=this;
    wx.showLoading({
      title: '预约中，请稍等',
    })
    wx.cloud.callFunction({
      name:'recordAdd',
      data:{
        collection:'reservation',
        addData:{
          _openid:userInfo._openid,
          creation_date: util.formatTime(new Date()),
          phone: phone,
          shop_code:that.data.data.shop[0].shop_code,
          act_id:that.data.data._id,
          act_code:that.data.data.act_code,
          shopping:that.data.nameList,
          time:that.data.startTime,
          timestamp:Date.parse(that.data.startTime.replace(/-/g, '/')) / 1000,
          user:userInfo.nickName,
          creation_timestamp: Date.parse(util.formatTime(new Date()).replace(/-/g, '/')) / 1000,
        }
      }
    }).then(res=>{
      console.log(res)
      wx.hideLoading()
      wx.showToast({
        title: '预约成功',
        icon:'success',
        duration:2000
      })
      wx.setStorageSync('refreshData', that.data.data)
      setTimeout(()=>{
        wx.navigateBack({
          delta: 0,
        })
      },1500)
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
    if(wx.getStorageSync('phone')){
      this.setData({isShow:false})
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})