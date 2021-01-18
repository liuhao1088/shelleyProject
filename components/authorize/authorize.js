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
    getPhoneNumber: function (e) {
      console.log(e)
    },
    //用户点击微信授权登录
    bindGetUserInfo: function (e) {
      if (e.detail.userInfo) {
        //用户按了允许授权按钮            
        var that = this;
        wx.showLoading({
          title: '登录中...',
        })
        //插入登录的用户的相关信息到数据库            
        this.hideModal();
        var app = getApp()
        wx.getSetting({
          success: res => {
            console.log(res)
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  let userInfo = res.userInfo;
                  wx.cloud.callFunction({
                    name: 'getOpenid',
                  }).then((res) => {
                    console.log(res)
                    let openid = res.result.openid;
                    app.globalData.openid = res.result.openid;
                    console.log(app.globalData.openid)
                    userInfo._openid = openid;
                    app.globalData.userInfo = userInfo;
                    const db = wx.cloud.database()
                    wx.cloud.callFunction({
                      name: 'multQuery',
                      data: {
                        collection: 'user',
                        match: {
                          _openid: openid
                        },
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
                      let user = res.result.list[0];
                      wx.setStorageSync('userInfo', user)
                      if (res.result.list.length == 0) {
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
                              authority: "primary",
                              type: 'driver'
                            }
                          })
                          .then(res => {
                            console.log(res)
                          })
                          .catch(console.error)
                          wx.setStorageSync('userInfo',userInfo)
                          wx.hideLoading()
                          wx.showToast({
                            title: '登录成功',
                            icon: "success",
                            duration: 1500
                          })
                      } else{
                        console.log(userInfo,openid)
                        if(userInfo.nickName!==res.result.list[0].nickName||userInfo.avatarUrl!==res.result.list[0].avatarUrl){
                          wx.cloud.callFunction({
                            name: 'recordUpdate',
                            data: {
                              collection: 'user',
                              where: {
                                _openid: openid
                              },
                              updateData: {
                                nickName: userInfo.nickName,
                                avatarUrl: userInfo.avatarUrl
                              }
                            }
                          })
                        }
                        wx.hideLoading()
                        wx.showToast({
                          title: '登录成功',
                          icon: "success",
                          duration: 1500
                        })
                        if(res.result.list[0].authority=='admin'){
                        
                        }
                      }
                    }).catch()
                  })



                  return true
                }
              })
            } else {
              that.authorize().showModal();
            }
          }
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