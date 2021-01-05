// pages/manage/examine/lookup.js
var editData;
var userInfo=wx.getStorageSync('userInfo')
var util=require('../../../utils/util.js')
var nowDate=util.formatTime(new Date());
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{},reason:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    editData = wx.getStorageSync('editData')
    if(editData.creation_date==undefined) editData.creation_date='无'
    this.setData({
      data:editData
    })
  },
  openLocation:function(){
    wx.openLocation({
      latitude: editData.lat,
      longitude: editData.lon,
    })
  },
  callPhone:function(){
    wx.makePhoneCall({
      phoneNumber: editData.phone,
    })
  },
  previewImg:function(e){
    var ind=e.currentTarget.dataset.index;
    console.log(this.data.data.shop_img[ind])
    wx.previewImage({
      current: this.data.data.shop_img[ind], // 当前显示图片的http链接
      urls:this.data.data.shop_img
    })
  },
  confirm:function(){
    var that=this;
    wx.showModal({
      title:'通过该门店认证',
      success:function(res){
        if(res.confirm){
          wx.showLoading({
            title: '认证中',
          })
          wx.cloud.database().collection('shop').where({prove:'success'}).orderBy('creation_date','desc').skip(0).limit(1).get().then(
            (res)=> {
              console.log(res)
              let num=res.data[0].shop_code+1;
              wx.cloud.callFunction({
                name:'recordUpdate',
                data:{
                  collection:'shop',
                  where:{_id:editData._id},
                  updateData:{
                    prove:'success',
                    shop_code:num,
                    checker:userInfo.nickName,
                    checker_openid:userInfo._openid,
                    check_date:nowDate,
                    check_timestamp:Date.parse(nowDate.replace(/-/g, '/')) / 1000
                  }
                }
              }).then(res=>{
                console.log(res)
                wx.cloud.callFunction({
                  name:'recordUpdate',
                  data:{
                    collection:'user',
                    where:{_openid:editData._openid},
                    updateData:{
                      type:'shopkeeper',
                    }
                  }
                }).then(res=>{console.log(res)})
                that.sendMessage("您的门店认证已经通过",editData.shop_name);
                editData.prove='success';
                editData.shop_code=num;
                editData.checker=userInfo.nickName;
                editData.checker_openid=userInfo._openid;
                editData.check_date=nowDate;
                editData.check_stamp=Date.parse(nowDate.replace(/-/g, '/')) / 1000;
                that.setData({data:editData})
                wx.hideLoading({
                  success: (res) => {},
                })
                wx.showToast({
                  title: '认证成功',
                  icon:'success',
                  duration:2000
                })
                wx.setStorageSync('refreshData', editData)
              })
            }
          )
          /**/
        }
      }
    })
  },
  cancel:function(){
    this.setData({modalName:'fail'})
  },
  hideModal:function(){
    this.setData({modalName:null})
  },
  inputReason:function(e){
    this.setData({reason:e.detail.value})
  },
  submit:function(){
    var that=this;
    if(this.data.reason!==""){
      wx.cloud.callFunction({
        name:'recordUpdate',
        data:{
          collection:'shop',
          where:{_id:editData._id},
          updateData:{
            prove:'fail',
            reason:that.data.reason,
            checker:userInfo.nickName,
            checker_openid:userInfo._openid,
            check_date:nowDate,
            check_stamp:Date.parse(nowDate.replace(/-/g, '/')) / 1000
          }
        },
      }).then(res=>{
        that.hideModal()
        that.sendMessage("您的门店信息已被驳回",that.data.reason);
        setTimeout(() => {
          wx.showToast({
            title: '已驳回',
            icon:'none',
            duration:1500
          })
        }, 1000);
        editData.prove='fail'
        editData.reason=that.data.reason;
        editData.checker=userInfo.nickName;
        editData.checker_openid=userInfo._openid;
        editData.check_date=nowDate;
        editData.check_stamp=Date.parse(nowDate.replace(/-/g, '/')) / 1000;
        that.setData({data:editData})
        wx.hideLoading()
        wx.setStorageSync('refreshData', editData)
      })
      
    }else{
      wx.showToast({
        title: '不能为空',
        icon:'none'
      })
    }
  },
  sendMessage:function(thing,content){
    wx.cloud.callFunction({
      name:'sendMessage',
      data:{
        openid:editData._openid,
        page:'pages/index/index',
        data:{
          "thing1": {
            "value": thing
          },
          "thing3": {
            "value": content
          },
        },
        templateId:'pvZ2jnDjUwfpT2bpby2SxP5P1tcl3LXcn9RfOc8ibuI'
      }
    }).then(res=>{
      console.log(res)
    })
  },
  tosubLookup:function(){
    if(editData.user){
      wx.showLoading({
        title: '跳转中',
      })
      wx.cloud.callFunction({
        name: 'multQuery',
        data: {
          collection: 'user',
          match: {_openid:editData._openid},
          or: [{}],
          and: [{}],
          lookup: {
            from: 'shop',
            localField: '_openid',
            foreignField: '_openid',
            as: 'shop',
          },
          lookup2: {
            from: 'coupon',
            localField: '_openid',
            foreignField: '_openid',
            as: 'coupon',
          },
          sort: {
            creation_date: -1
          },
          skip: 0,
          limit: 1
        }
      }).then(res => {
        console.log(res)
        let data=res.result.list[0];
        wx.setStorageSync('editData', data)
        wx.navigateTo({
          url: '../user/lookup',
        })
        wx.hideLoading({
          success: (res) => {},
        })
      })
    }
  },
  tocheckLookup:function(){
    if(editData.checker){
      wx.showLoading({
        title: '跳转中',
      })
      wx.cloud.callFunction({
        name: 'multQuery',
        data: {
          collection: 'user',
          match: {_openid:editData._openid},
          or: [{}],
          and: [{}],
          lookup: {
            from: 'shop',
            localField: '_openid',
            foreignField: '_openid',
            as: 'shop',
          },
          lookup2: {
            from: 'coupon',
            localField: '_openid',
            foreignField: '_openid',
            as: 'coupon',
          },
          sort: {
            creation_date: -1
          },
          skip: 0,
          limit: 1
        }
      }).then(res => {
        console.log(res)
        let data=res.result.list[0];
        wx.setStorageSync('editData', data)
        wx.navigateTo({
          url: '../user/lookup',
        })
        wx.hideLoading({
          success: (res) => {},
        })
      })
    }
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