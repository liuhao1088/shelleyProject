// pages/myCoupon/myCoupon.js
var skip = 0;
let pro = 0;
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    stamp: '',
    code: '',
    cou_ind: 0,
    cou_checked: false,
    cou_id: '',
    navId: 0,
    currentId: 0,
    height: 0,
    usable_list: [],
    unusable_list: [],
    loadProgress: 0,
    complete: false,
    hiddenFlag: true,
  },
  changNav(event) {
    let navId = event.currentTarget.dataset.id; //获取导航栏下标
    if (this.data.currentId == navId) {
      return false;
    } else {
      this.setData({
        currentId: navId
      })
    }
    this.setData({
      navId,
    })
  },
  showModal(e) {
    let ind = e.currentTarget.dataset.index;
    switch(this.data.cou_id){
      case '':
        break;
      default:
        if(this.data.usable_list[ind].team){
          this.setData({cou_checked:true})
        }else{
          this.setData({cou_checked:false})
        }
    }
    this.setData({
      modalName: e.currentTarget.dataset.target,
      cou_ind: ind
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
  inputCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (wx.getStorageSync('userInfo')) {
      skip = 0;
      this.loadData();
    } else {
      // wx.showToast({
      //   title: '暂无卡券',
      //   icon: 'none',
      //   duration: 10000000
      // })
      this.setData({
        complete: true,
        hiddenFlag:false
      })
    }
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
    this.setData({
      height: windowHeight * 750 / windowWidth - 200 - 30
    })


    // 倒计时
    that.setData({
      loading: true
    })

    var that = this;
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('prize')) {
      let userInfo = wx.getStorageSync('userInfo')
      let data = wx.getStorageSync('prize');
      if (data.length == 0) {
        that.setData({
          cou_checked: false
        })
      }else{
        if (data[0].status) {
          if (data[0].status == 'complete') {
            that.setData({
              cou_checked: false
            })
          } else {
            that.setData({
              cou_checked: true,
              cou_id: data[0].cou_code
            })
          }
        }
      }
    }

  },
  submit: function () {
    var that = this;
    let shop_code = that.data.usable_list[that.data.cou_ind].shop_code;
    if (that.data.code == shop_code|| that.data.code == '0'+JSON.stringify(shop_code)|| that.data.code == '00'+JSON.stringify(shop_code) || shop_code == 'all') {
      that.apply(that.data.cou_ind, that.data.usable_list[that.data.cou_ind]._id)
      if (that.data.cou_checked == true) {
        let list = that.data.usable_list;
        var index = list.findIndex(function (item) {
          return item.shop_code == "all" && item.act_id == '-1';
        });
        that.apply(index,list[index]._id)   
      }
    } else {
      wx.showToast({
        title: '门店码错误',
        icon: 'none',
        duration: 2000
      })
    }
  },
  apply: function (indx, id) {
    var that = this;
    wx.showLoading({
      title: '使用中，请稍等',
    })
    wx.cloud.callFunction({
      name: 'recordUpdate',
      data: {
        collection: 'coupon',
        where: {
          _id: id
        },
        updateData: {
          status: 'complete',
          apply_code: that.data.code
        }
      }
    }).then(res => {
      wx.hideLoading({
        success: (res) => {},
      })
      if (res.result.stats.updated == 1) {
        let list = that.data.usable_list;
        list[indx].status = 'complete'
        list[indx].usable = false;
        if (list[indx].sort == 'Q&A') {
          that.setData({
            cou_checked: false,
            cou_id:''
          })
          let prize = wx.getStorageSync('prize');
          prize.status = 'complete';
          wx.setStorageSync('prize', prize)
        }
        that.setData({
          usable_list: list,
          modalName: null
        })
        wx.showToast({
          title: '使用成功',
          icon: 'success',
          duration: 1500
        })
      } else {
        wx.showModal({
          title: '网络繁忙，请稍后重试',
          showCancel: false
        })
      }

    }).catch(error => {
      wx.showModal({
        title: '网络繁忙，请稍后重试',
        showCancel: false
      })
    })
  },
  loadData: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    let userInfo = wx.getStorageSync('userInfo')
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
        limit: 30
      }
    }).then(res => {
      let data = res.result.list;
      wx.hideLoading({
        success: (res) => {},
      })
      if (data.length == 0) {
        that.setData({
          complete: true,
          hiddenFlag:false
        })
       
        // wx.showToast({
        //   title: '暂无更多卡券',
        //   icon: 'none'
        // })
      }
      let stamp = Date.parse(util.formatTimes(new Date()).replace(/-/g, '/')) / 1000;
      that.setData({
        stamp: stamp
      })
      for (let i = 0; i < data.length; i++) {
        data[i].usable = true;
        if(data[i].end_timestamp){
          if (stamp >= data[i].end_timestamp) {
            data[i].usable = false; //过期
          }
        }
        if (data[i].act.length > 0) {
          if (stamp >= data[i].act[0].end_timestamp) {
            data[i].usable = false; //过期
          }
          if (data[i].status == 'success' && stamp < data[i].act[0].end_timestamp) {
            let remain = data[i].act[0].end_timestamp - stamp;
            data[i].percent = (remain / (data[i].act[0].end_timestamp - data[i].act[0].start_timestamp)) * 100 + '%';
            let day = Math.floor(remain / (60 * 60 * 24));
            if (day > 10) {
              data[i].remain = data[i].act[0].end_date;
            } else if (day >= 1 && day <= 10) {
              data[i].remain = parseInt(remain / (60 * 60 * 24)) + ' 天';
            } else {
              data[i].remain = parseInt(remain / (60 * 60)) + ' 小时';
            }
          }
        }
        if (data[i].status == 'waiting') {
          if (stamp >= data[i].creation_timestamp + parseInt(data[i].shopping.time) * 60) {
            data[i].usable = false; //拼团失败
          }
          data[i].surplus = parseInt((data[i].creation_timestamp + parseInt(data[i].shopping.time) * 60 - stamp) / 60)
        }
        if (data[i].status == 'complete') {
          data[i].usable = false; //已使用
        }

        if (i + 1 == data.length) {
          let usable = that.data.usable_list.concat(data.filter(item => item.usable == true))
          let unusable = that.data.unusable_list.concat(data.filter(item => item.usable !== true))
          console.log(usable,unusable)
          that.loadProgress(100)
          that.setData({
            complete: true,
            hiddenFlag:false
          })

          that.setData({
            usable_list: usable,
            unusable_list: unusable
          })
        }
      }
      if (data.length == 0 && that.data.usable_list == 0 && that.data.unusable_list.length == 0) {
        that.loadProgress(100)
        that.setData({
          complete: true,
          hiddenFlag:false
        })
        // wx.showToast({
        //   title: '暂无卡券',
        //   icon: 'none',
        //   duration: 100000000
        // })
      }
    })

  },
  loadProgress() {
    this.setData({
      loadProgress: pro
    })
    if (this.data.loadProgress >= 100) {
      if(pro>=100){
        pro=0;
      }
      do {
        this.loadProgress(pro)
        pro = pro + 3;
      } while (pro < 100)
      this.setData({
        loadProgress: 0
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
  onReachBottom: function () {},

  more: function () {
    skip = skip + 30;
    this.loadData();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this;
    var ind = res.target.dataset.index;
    if (res.from === 'button') {
      return {
        title: "【仅剩1个名额】我领了100元拼团券，快来助我成团激活~", //分享标题
        imageUrl: 'https://img13.360buyimg.com/ddimg/jfs/t1/160040/27/61/289416/5fe99874E75804776/891b1b08109afc6d.png', //图片路径
        path: 'pages/groupSpecial/groupSpecial?act_id=' + that.data.usable_list[ind].act_id + '&cou_code=' + that.data.usable_list[ind].cou_code + '&end_timestamp=' + that.data.usable_list[ind].act[0].end_timestamp
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