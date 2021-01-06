// pages/carAppointment/carAppointment.js\
var nowDate=require('../../utils/util').formatTime(new Date())
var skip = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    search: '',
    searchlist: [],
    search_whether: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    skip = 0;
    that.loadData()
  },
  inputSearch: function (e) {
    this.setData({
      search: e.detail.value
    })
  },
  toSearch: function () {
    if (this.data.search !== '') {
      var that = this;
      let userInfo = wx.getStorageSync('userInfo')
      wx.cloud.database().collection('reservation').where({
        shop_code: userInfo.shop[userInfo.shop.length - 1].shop_code
      }).where({
        re_code: {
          $regex: '.*' + that.data.search,
          $options: 'i'
        }
      }).orderBy('creation_date', 'desc').get().then(res => {
        if (res.data.length == 0) {
          that.setData({
            searchlist: [],
            search_whether: false
          })
          wx.showToast({
            title: '预约单号不存在',
            icon: 'none',
            duration: 1500
          })
        } else {
          let data = res.data
          for (let i = 0; i < data.length; i++) {
            data[i].label = data[i].shopping.join(',')
            if (i + 1 == data.length) {
              that.setData({
                searchlist: data
              })
            }
          }
          that.setData({
            search_whether: true
          })
        }
      })
    } else {
      this.setData({
        searchlist: [],
        search_whether: false
      })
      wx.showToast({
        title: '预约单号不存在',
        icon: 'none',
        duration: 1500
      })
    }
  },
  loadData: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    let userInfo = wx.getStorageSync('userInfo')
    wx.cloud.database().collection('reservation').where({
      shop_code: userInfo.shop[userInfo.shop.length - 1].shop_code
    }).orderBy('creation_date', 'desc').skip(skip).limit(5).get().then(res => {
      let data = res.data;
      for (let i = 0; i < data.length; i++) {
        data[i].label = data[i].shopping.join(',')
        if (i + 1 == data.length) {
          let alldata = that.data.list.concat(data)
          that.setData({
            list: alldata
          })
        }
      }
      wx.hideLoading()
      if (data.length == 0) {
        wx.showToast({
          title: '没有更多预约',
          icon: 'none',
          duration: 1500
        })
      }
      if (that.data.list.length == 0) {
        wx.showToast({
          title: '暂无预约',
          icon: 'none',
          duration: 10000000
        })
      }
    }).catch(error => {
      wx.hideLoading()
      wx.showToast({
        title: '网络繁忙，请稍后重试',
        icon: 'none',
        duration: 3000
      })
    })
  },
  confirm:function(e){
    var that=this;
    var ind=e.currentTarget.dataset.index;
    let userInfo=wx.getStorageSync('userInfo')
    wx.requestSubscribeMessage({
      tmplIds: ['SKiAQj0y7dfeW194AbS_uHnRfoqxuE_kz8Y-9uKeJwM'],
      success(res) {
        if (JSON.stringify(res).indexOf('accept') !== -1) {
          wx.showLoading({
            title: '接受中',
          })
          wx.cloud.callFunction({
            name: 'recordUpdate',
            data: {
              collection: 'reservation',
              where: {
                _id: that.data.list[ind]._id
              },
              updateData: {
                status: 'success'
              }
            }
          }).then(res => {
            if (res.result.stats.updated == 1) {
              let list = that.data.list;
              list[ind].status = 'success'
              if (userInfo.shop[userInfo.shop.length - 1].shop_name.length > 9) {
                userInfo.shop[userInfo.shop.length - 1].shop_name = userInfo.shop[userInfo.shop.length - 1].shop_name.substring(0, 6) + '...'
              }
              that.successMessage(list[ind]._openid, list[ind].time_date, '店家（' + userInfo.shop[userInfo.shop.length - 1].shop_name + '）已接受您的预约')
              wx.cloud.callFunction({
                name:'recordAdd',
                data:{
                  collection:'message',
                  addData:{
                    creation_date:nowDate,
                    creation_timestamp:Date.parse(nowDate.replace(/-/g, '/')) / 1000,
                    _openid:list[ind]._openid,
                    title:'店家（' + userInfo.shop[userInfo.shop.length - 1].shop_name + '）已接受您的预约',
                    content:list[ind].time_date,
                    type:'re',
                    res:'success',
                    read:'unread'
                  }
                }
              })
              wx.showToast({
                title: '已接受预约',
                icon: 'success',
                duration: 2000
              })
              that.setData({
                list: list
              })
            } else {
              wx.showToast({
                title: '网络繁忙，请稍后重试',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      }
    })

  },
  cancel: function (e) {
    var that = this;
    var ind = e.currentTarget.dataset.index;
    wx.requestSubscribeMessage({
      tmplIds: ['SKiAQj0y7dfeW194AbS_uHnRfoqxuE_kz8Y-9uKeJwM'],
      success(res) {
        if (JSON.stringify(res).indexOf('accept') !== -1) {
          wx.showLoading({
            title: '取消中',
          })
          wx.cloud.callFunction({
            name: 'recordDelete',
            data: {
              collection: 'reservation',
              where: {
                _id: that.data.list[ind]._id
              }
            }
          }).then(res => {
            skip = skip - 1;
            let list = that.data.list;
            wx.setStorageSync('_quit', list[ind]._openid)
            list.splice(ind, 1)
            that.setData({
              list: list
            })
            let userInfo = wx.getStorageSync('userInfo')
            let id=wx.getStorageSync('_quit')
            let name=userInfo.shop[userInfo.shop.length - 1].shop_name.substring(0,19);
            that.quitMessage(id, name, '店主取消预约')
            wx.cloud.callFunction({
              name:'recordAdd',
              data:{
                collection:'message',
                addData:{
                  creation_date:nowDate,
                  creation_timestamp:Date.parse(nowDate.replace(/-/g, '/')) / 1000,
                  _openid:list[ind]._openid,
                  title:'店家（' + userInfo.shop[userInfo.shop.length - 1].shop_name + '）取消了您的预约',
                  content:list[ind].time_date,
                  type:'re',
                  res:'fail',
                  read:'unread'
                }
              }
            })
            wx.hideLoading({
              success: (res) => {},
            })
            wx.showToast({
              title: '取消成功',
            })
            wx.removeStorageSync('_quit')
          })
        }
      }
    })
  },
  successMessage: function (openid, time, tips) {
    wx.cloud.callFunction({
      name: 'sendMessage',
      data: {
        openid: openid,
        page: 'pages/index/index',
        data: {
          "time1": {
            "value": time
          },
          "phrase2": {
            "value": '到店预约'
          },
          "thing9": {
            "value": tips
          },
        },
        templateId: '-m92htbt5V0SlqRwZaMZAy9l3mv3CNseLM-yDKlRG5g'
      }
    }).then(res => {})
  },
  quitMessage: function (openid, name, reason) {
    wx.cloud.callFunction({
      name: 'sendMessage',
      data: {
        openid: openid,
        page: 'pages/index/index',
        data: {
          "thing1": {
            "value": name
          },
          "thing5": {
            "value": reason
          },
        },
        templateId: 'SVnl7juS4DJeu57ZvCHsFtWrp3y1bfTT7_rbv36mXY0'
      }
    }).then(res => {})
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
    skip = skip + 5;
    this.loadData()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})