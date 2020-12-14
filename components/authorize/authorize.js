// components/authorize/authorize.js
var util = require('../../utils/util.js');
var nowdate = util.nowTime(new Date());
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    modalName: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //弹出登录模态窗
    showModal(e) {
      this.setData({
        modalName: "bottomModal"
      })
     
      //隐藏tabbar
      //this.getTabBar().displayHide();
    },
    //关闭模态窗
    hideModal(e) {
      this.setData({
        modalName: null
      })
      
      //显示
      //this.getTabBar().displayShow();
    },
    //用户点击微信授权登录
    bindGetUserInfo: function (e) {
      if (e.detail.userInfo) {
        //用户按了允许授权按钮            
        var that = this;
        //插入登录的用户的相关信息到数据库            
        this.hideModal();
        var app=getApp()
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  let userInfo = res.userInfo;
                  wx.cloud.callFunction({
                    name:'getOpenid',
                  }).then((res)=>{
                    console.log(res)
                    let openid=res.result.openid;
                    app.globalData.openid=res.result.openid;
                    console.log(app.globalData.openid)
                    userInfo._openid=openid;
                    const db = wx.cloud.database()
                    db.collection('user').where({
                      _openid: openid
                    }).get().then(res => {
                      if (res.data.length == 0) {
                        let sex;
                        console.log(res, userInfo.nickName, userInfo.avatarUrl, userInfo.province, userInfo.city)
                        if (userInfo.gender == 1) {
                          sex = "男"
                        } else if (userInfo.gender == 2) {
                          sex = "女"
                        } else {
                          sex = '未知'
                        }
                        const db = wx.cloud.database()
                        const creation_date = util.formatTime(new Date())
                        db.collection('user').add({
                            // data 字段表示需新增的 JSON 数据
                            data: {
                              creation_date: creation_date,
                              creation_timestamp: Date.parse(creation_date.replace(/-/g, '/')) / 1000,
                              nickName: userInfo.nickName,
                              avatarUrl: userInfo.avatarUrl,
                              sex: sex,
                              province: userInfo.province,
                              city: userInfo.city,
                              authority: "primary"
                            }
                          })
                          .then(res => {
                            console.log(res)
                          })
                          .catch(console.error)
                          wx.setStorageSync('userInfo',userInfo)
                      } else if (res.data.length == 1) {
                        console.log(userInfo,openid)
                        if(userInfo.nickName!==res.data[0].nickName){
                          wx.cloud.callFunction({
                            name:'collectionUpdate',
                            data:{
                              collection:'user',
                              where:{_openid:openid},
                              updateData:{
                                nickName:userInfo.nickName,
                                avatarUrl:userInfo.avatarUrl
                              }
                            }
                          })
                        }
                        wx.setStorageSync('userInfo',userInfo)
                        if(res.data[0].authority=='admin'){
                          wx.navigateTo({
                            url: '/pages/manage/manage',
                          })
                        }
                      }
                    }).catch()
                  })
                  /*

                  /*wx.cloud.callFunction({
                    name: "collectionAdd", //
                    data: {
                      collection: 'user', //集合名称
                      addData: {
                        name: userInfo.nickName,
                        avatarUrl: userInfo.avatarUrl,
                        sex: sex,
                        province: userInfo.province,
                        city: userInfo.city,
                        authority: "primary"
                      },
                    }
                  }).then(res => {
                    console.log('更新数据库成功', res)
                  }).catch(console.error)*/
                  return true
                }
              })
            } else {
              that.authorize().showModal();
            }
          }
        })
        wx.showToast({
          title: '登录成功',
          icon: "success",
          duration: 1500
        })
      } else { //用户按了拒绝按钮           

      }
    },
    //隐私政策
    gotoPrivacy: function () {
      wx.navigateTo({
        url: '../../pages/index/privacy/privacy',
      })
    }
  }
})