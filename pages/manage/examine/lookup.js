// pages/manage/examine/lookup.js
var editData;
var userInfo=wx.getStorageSync('userInfo')
var util=require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{},reason:'',z:-1
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
  openLocation:function(e){
    switch(e.target.dataset.category){
      case 'original':
        wx.openLocation({
          latitude: editData.lat,
          longitude: editData.lon,
        })
        break;
      default:
        wx.openLocation({
          latitude: editData.modify_lat,
          longitude: editData.modify_lon,
        })
    }
  },
  callPhone:function(e){
    switch(e.target.dataset.category){
      case 'original':
        wx.makePhoneCall({
          phoneNumber: editData.phone,
        })
        break;
      default:
        wx.makePhoneCall({
          phoneNumber: editData.modify_phone,
        })
    }
  },
  previewImg:function(e){
    var ind=e.currentTarget.dataset.index;
    var sort=e.currentTarget.dataset.sort;
    let img=[]
    if(sort=='original'){
      img=this.data.data.shop_img
    }else{
      img=this.data.data.modify_shop_img
    }
    console.log(img[ind])
    wx.previewImage({
      current: img[ind], // 当前显示图片的http链接
      urls:img
    })
  },
  confirm:function(){
    var that=this;
    var nowDate=util.formatTime(new Date());
    if(editData.modify){
      wx.showModal({
        title:'通过该门店修改',
        success:function(res){
          if(res.confirm){
            wx.showLoading({
              title: '修改中',
            })
            let data={};
            if(editData.modify_address){
              data.address=editData.modify_address
              data.address_name = editData.modify_address_name
              data.detail = editData.modify_detail
              data.lon = editData.modify_lon
              data.lat = editData.modify_lat
            }
            if(editData.modify_shop_name){
              data.shop_name=editData.modify_shop_name
            }
            if(editData.modify_person){
              data.person=editData.modify_person
            }
            if(editData.modify_phone){
              data.phone=editData.modify_phone
            }
            if(editData.modify_start_hour){
              data.start_hour=editData.modify_start_hour
            }
            if(editData.modify_end_hour){
              data.end_hour=editData.modify_end_hour
            }
            if(editData.modify_shop_img){
              data.shop_img=editData.modify_shop_img
              wx.cloud.deleteFile({
                fileList: editData.shop_img,
                success: res => {
                  // handle success
                  console.log(res.fileList)
                },
                fail: err => {
                  // handle error
                },
                complete: res => {
                  // ...
                }
              })
            }
            wx.cloud.callFunction({
              name:'recordUpdate',
              data:{
                collection:'shop',
                where:{_id:editData._id},
                updateData:data
              }
            }).then(res=>{
              let name;
              if(data.shop_name){
                name=data.shop_name
              }else{
                name=editData.shop_name
              }
              that.sendMessage("修改门店成功",name);
              wx.cloud.callFunction({
                name:'recordAdd',
                data:{
                  collection:'message',
                  addData:{
                    creation_date:nowDate,
                    creation_timestamp:Date.parse(nowDate.replace(/-/g, '/')) / 1000,
                    _openid:editData._openid,
                    shop_code:editData.shop_code,
                    shop_id:editData._id,
                    title:"修改门店成功",
                    content:'您修改门店 '+name+' 已审核通过，门店信息已更新，更多赋能等待您的体验~。',
                    type:'check',
                    res:'success',
                    read:'unread'
                  }
                }
              })
              if(editData.modify_address){
                editData.address=editData.modify_address
                editData.address_name = editData.modify_address_name
                editData.detail = editData.modify_detail
                editData.lon = editData.modify_lon
                editData.lat = editData.modify_lat
                delete editData.modify_address,editData.modify_address_name, editData.modify_detail,editData.modify_lon,editData.modify_lat
              }
              if(editData.modify_shop_name){
                editData.shop_name=editData.modify_shop_name
                delete editData.modify_shop_name
              }
              if(editData.modify_person){
                editData.person=editData.modify_person
                delete editData.modify_person
              }
              if(editData.modify_phone){
                editData.phone=editData.modify_phone
                delete editData.modify_phone
              }
              if(editData.modify_start_hour){
                editData.start_hour=editData.modify_start_hour
                delete editData.modify_start_hour
              }
              if(editData.modify_end_hour){
                editData.end_hour=editData.modify_end_hour
                delete editData.modify_end_hour
              }
              if(editData.modify_shop_img){
                wx.cloud.deleteFile({
                  fileList: editData.shop_img,
                  success: res => {
                    // handle success
                    console.log(res.fileList)
                  },
                  fail: err => {
                    // handle error
                  },
                  complete: res => {
                    // ...
                  }
                })
                editData.shop_img=editData.modify_shop_img
                delete editData.modify_shop_img
              }
              delete editData.modify
              const db=wx.cloud.database();
              const _ = db.command
              db.collection('shop').where({_id:editData._id}).update({
                data: {
                  modify: _.remove(),
                  modify_address: _.remove(),
                  modify_address_name: _.remove(),
                  modify_detail: _.remove(),
                  modify_lon: _.remove(),
                  modify_lat: _.remove(),
                  modify_shop_name:_.remove(),
                  modify_shop_img:_.remove(),
                  modify_start_hour:_.remove(),
                  modify_end_hour:_.remove(),
                  modify_phone:_.remove(),
                  modify_person:_.remove(),
                }
              }).then(res=>{console.log(res)})
              that.setData({data:editData})
              wx.hideLoading({
                success: (res) => {},
              })
              wx.showToast({
                title: '通过成功',
                icon:'success',
                duration:2000
              })
              wx.setStorageSync('refresh', editData)
            })
          }
        }
      })
    }else{
      wx.showModal({
        title:'通过该门店认证',
        success:function(res){
          if(res.confirm){
            wx.showLoading({
              title: '认证中',
            })
            wx.cloud.database().collection('shop').where({prove:'success'}).count({
              success:function(res){
                console.log(res)
                let num=res.total+1;
                wx.cloud.callFunction({
                  name:'recordUpdate',
                  data:{
                    collection:'shop',
                    where:{_id:editData._id},
                    updateData:{
                      prove:'success',
                      team_using:true,
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
                  that.sendMessage("门店认证成功",editData.shop_name);
                  wx.cloud.callFunction({
                    name:'recordAdd',
                    data:{
                      collection:'message',
                      addData:{
                        creation_date:nowDate,
                        creation_timestamp:Date.parse(nowDate.replace(/-/g, '/')) / 1000,
                        _openid:editData._openid,
                        shop_code:num,
                        title:"认证门店成功",
                        content:'您的认证门店 '+editData.shop_name+' 已审核通过，门店信息已更新，更多赋能等待您的体验~。',
                        type:'check',
                        res:'success',
                        read:'unread'
                      }
                    }
                  })
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
            })
            /**/
          }
        }
      })
    }
    
  },
  cancel:function(){
    this.setData({modalName:'fail',z:200})
  },
  hideModal:function(){
    this.setData({modalName:null,z:-1})
  },
  inputReason:function(e){
    this.setData({reason:e.detail.value})
  },
  submit:function(){
    var that=this;
    var nowDate=util.formatTime(new Date());
    if(this.data.reason!==""){
      wx.showLoading({
        title: '驳回中',
      })
      if(editData.modify){
        const db=wx.cloud.database();
        const _ = db.command
        db.collection('shop').where({_id:editData._id}).update({
          data: {
            modify: _.remove(),
            modify_address: _.remove(),
            modify_address_name: _.remove(),
            modify_detail: _.remove(),
            modify_lon: _.remove(),
            modify_lat: _.remove(),
            modify_shop_name:_.remove(),
            modify_shop_img:_.remove(),
            modify_start_hour:_.remove(),
            modify_end_hour:_.remove(),
            modify_phone:_.remove(),
            modify_person:_.remove(),
          }
        }).then(res=>{
          console.log(res)
          delete editData.modify_address,editData.modify_address_name, editData.modify_detail,editData.modify_lon,editData.modify_lat,editData.modify_shop_name,editData.modify_person,editData.modify_phone,editData.modify_start_hour,editData.modify_end_hour
          if(editData.modify_shop_img){
            wx.cloud.deleteFile({
              fileList: editData.modify_shop_img,
              success: res => {
                // handle success
                console.log(res.fileList)
              },
              fail: err => {
                // handle error
              },
              complete: res => {
                // ...
              }
            })
            delete editData.modify_shop_img
          }
          delete editData.modify
          that.hideModal()
          that.sendMessage("门店修改未通过",that.data.reason);
          wx.cloud.callFunction({
            name:'recordAdd',
            data:{
              collection:'message',
              addData:{
                creation_date:nowDate,
                creation_timestamp:Date.parse(nowDate.replace(/-/g, '/')) / 1000,
                _openid:editData._openid,
                shop_code:'none',
                title:"门店修改未通过",
                content:'您修改门店 ' +editData.shop_name+' 经审核未通过，原因： '+ that.data.reason+'，请您确认好资料后重新提交。',
                type:'check',
                res:'fail',
                read:'unread'
              }
            }
          })
          wx.showToast({
            title: '已驳回',
            icon:'none',
            duration:1500
          })  
          that.setData({data:editData})
          wx.hideLoading()
          wx.setStorageSync('refresh', editData)
        })      
      }else{
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
          that.sendMessage("认证门店未通过",that.data.reason);
          wx.cloud.callFunction({
            name:'recordAdd',
            data:{
              collection:'message',
              addData:{
                creation_date:nowDate,
                creation_timestamp:Date.parse(nowDate.replace(/-/g, '/')) / 1000,
                _openid:editData._openid,
                shop_code:'none',
                title:"认证门店未通过",
                content:'您的认证门店 ' +editData.shop_name+' 经审核未通过，原因： '+ that.data.reason+'，请您确认好资料后重新提交。',
                type:'check',
                res:'fail',
                read:'unread'
              }
            }
          })
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
      }
      
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
          match: {_openid:editData.checker_openid},
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