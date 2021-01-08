// pages/groupSpecial/groupSpecial.js
var util = require('../../utils/util.js')
var share_coupon;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkbox: [{
      id: 0,
      name: '行车记录仪',
      checked: false,
    }, {
      id: 1,
      name: '专车专用记录仪',
      checked: false,
    }, {
      id: 2,
      name: '智能车机',
      checked: false,
    }, {
      id: 3,
      name: '隐形车衣',
      checked: false,
    }],
    nowDate: '2020-12-22 18:00:00', //结束时间
    countdown: '', //倒计时
    days: '00', //天
    hours: '00', //时
    minutes: '00', //分
    seconds: '01', //秒
    data: '',
    avatarUrl: '',
    waresInd: 0,
    userInfo: '',
    userInd: 0,
    cou_code: '',
    transfer: false,
    sponsor: '',
    surplustime: '',
    surplusperson: '',
    action: 'going',
    userList:[
      {
        img:'',
        name:'测试1',
        time:'20:00'
      },
      {
        img:'',
        name:'测试2',
        time:'10:00'
      },
      {
        img:'',
        name:'测试2',
        time:'30:00'
      }
    ]

  },
  toActivityRule(event) {
    wx.navigateTo({
      url: '/pages/activityRule/activityRule',
    })
  },
  toMyCoupon(event) {
    wx.navigateTo({
      url: '/pages/myCoupon/myCoupon',
    })
    this.hideModal();
  },
  toReserveStore(e) {
    wx.navigateTo({
      url: '/pages/reserveStore/reserveStore',
    })
    this.setData({
      modalName: null
    })
  },

  //弹窗
  showModal(e) {
    let that = this;
    let target = e.currentTarget.dataset.target;
    let ind = e.currentTarget.dataset.index;
    that.setData({
      waresInd: ind
    })
    console.log(that.data.waresInd)
    if (target === 'goGroupSuccess') {
      wx.showLoading({
        title: '加载中...',
      })
      setTimeout(function () {
        that.setData({
          modalName: target
        })
        wx.hideLoading({
          success: (res) => {},
        })
      }, 1000)

    } else {
      that.setData({
        modalName: target
      })
    }
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      transfer: false
    })
  },

  goGroupSuccessModal(e) {

  },
  // 多选
  ChooseCheckbox(e) {
    console.log(e)
    let items = this.data.checkbox;
    let id = e.currentTarget.id;
    console.log(id)
    for (let i = 0; i < items.length; ++i) {
      if (items[i].id == id) {
        console.log(items[i].id)
        items[i].checked = !items[i].checked;
        break
      }
    }
    this.setData({
      checkbox: items
    })
  },

  //倒计时
  countTime() {
    let nowDate = this.data.nowDate;
    console.log(nowDate)
    let that = this;
    let now = new Date().getTime();
    let end = new Date(nowDate).getTime(); //设置截止时间
    console.log("开始时间：" + now, "截止时间:" + end);
    let leftTime = end - now; //时间差                         
    let day, hou, min, sec;
    if (leftTime >= 0) {
      day = Math.floor(leftTime / 1000 / 60 / 60 / 24);
      hou = Math.floor(leftTime / 1000 / 60 / 60 % 24);
      min = Math.floor(leftTime / 1000 / 60 % 60);
      sec = Math.floor(leftTime / 1000 % 60);
      day = day < 10 ? "0" + day : day
      sec = sec < 10 ? "0" + sec : sec
      min = min < 10 ? "0" + min : min
      hou = hou < 10 ? "0" + hou : hou
      that.setData({
        countdown: hou + ":" + min + ":" + sec,
        day,
        hou,
        min,
        sec
      })
      //递归每秒调用countTime方法，显示动态时间效果
      setTimeout(that.countTime, 1000);
    } else {
      that.setData({
        countdown: '已截止'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.act_id) {
      let nowstamp = Date.parse(util.formatTimes(new Date()).replace(/-/g, '/')) / 1000
      if (nowstamp >= options.end_timestamp) {
        wx.showModal({
          title: '该拼团活动已经结束',
          showCancel: false,
        })
      } else {
        console.log(options)
        wx.cloud.callFunction({
          name: "getRecord",
          data: {
            collection: 'coupon',
            where: {
              act_id: options.act_id,
              cou_code: options.cou_code
            },
            ordername: 'creation_date',
            order: 'asc',
            skip: 0
          }
        }).then(res => {
          console.log(res)
          let data = res.result.data[0];
          share_coupon = data;
          let surplustime = 0;
          if (nowstamp >= data.creation_timestamp + (parseInt(data.shopping.time) * 60)) {
            wx.showModal({
              title: '该拼团已过期',
              showCancel: false,
            })
          } else {
            surplustime = parseInt(parseInt(data.shopping.time) - (nowstamp - data.creation_timestamp) / 60)
            let sponsor = {}
            if (data.team[0].nickName.length > 2) {
              let start = data.team[0].nickName.substring(0, 1)
              let end = data.team[0].nickName.substring(data.team[0].nickName.length - 1)
              data.team[0].nickName = start + '***' + end
            }
            sponsor.nickName = data.team[0].nickName;
            sponsor.avatarUrl = data.team[0].avatarUrl;
            sponsor._openid = data.team[0]._openid;
            that.setData({
              sponsor: sponsor,
              surplustime: surplustime,
              surplusperson: data.shopping.people - data.team.length,
              modalName: 'goGroup',
              transfer: true
            })
          }
        })
      }
      wx.cloud.callFunction({
        name: 'multQuery',
        data: {
          collection: 'activity',
          match: {
            _id: options.act_id
          },
          or: [{}],
          and: [{}],
          lookup: {
            from: 'shop',
            localField: 'shop_code',
            foreignField: 'shop_code',
            as: 'shop',
          },
          lookup2: {
            from: 'user',
            localField: '_openid',
            foreignField: '_openid',
            as: 'user',
          },
          sort: {
            creation_date: -1
          },
          skip: 0,
          limit: 1
        }
      }).then(res => {
        let data = res.result.list[0];
        that.arrange(data);
      })
    } else {
      let data = wx.getStorageSync('nearby');
      if (data == undefined || data == '') {
        wx.showToast({
          title: '附近暂无拼团活动',
          icon: 'none',
          duration: 100000000
        })
      }
      that.arrange(data);
    }
  },
  //生成拼团券
  increase: function (shape, mol, indx, code, team) {
    var that = this;
    wx.showLoading({
      title: '拼团中'
    })
    let userInfo = wx.getStorageSync('userInfo')
    this.setData({
      avatarUrl: userInfo.avatarUrl
    })
    let obj = {};
    obj._openid = userInfo._openid;
    obj.nickName = userInfo.nickName;
    obj.avatarUrl = userInfo.avatarUrl;
    team.push(obj)
    if (code == '') {
      for (let e = 0; e < 10; e++) {
        code += Math.floor(Math.random() * 10)
      }
    }
    wx.cloud.callFunction({
      name: 'recordAdd',
      data: {
        collection: 'coupon',
        addData: {
          creation_date: util.formatTimes(new Date()),
          creation_timestamp: Date.parse(util.formatTimes(new Date()).replace(/-/g, '/')) / 1000,
          cou_code: code,
          _openid: userInfo._openid,
          user: userInfo.nickName,
          shop_code: that.data.data.shop_code,
          shop_id: that.data.data.shop[0]._id,
          act_code: that.data.data.act_code,
          act_id: that.data.data._id,
          shopping: that.data.data.shopping[indx],
          shopping_ind: indx,
          team: team,
          status: shape
        }
      }
    }).then(res => {
      console.log(res)
      let data = that.data.data;
      data.shopping[indx].status = true
      that.setData({
        modalName: mol,
        avatarUrl: '',
        data: data,
        cou_code: code
      })
      wx.hideLoading()
    }).catch(error => {
      wx.hideLoading({
        success: (res) => {},
      })
      wx.showModal({
        showCancel: false,
        title: '系统繁忙，请稍后重试'
      })
    })
  },
  //整理数据
  arrange: function (data) {
    var that = this;
    let nowstamp = Date.parse(util.formatTimes(new Date()).replace(/-/g, '/')) / 1000
    if (wx.getStorageSync('userInfo')) {
      let userInfo = wx.getStorageSync('userInfo')
      that.setData({
        userInfo: userInfo
      })
      let cou = userInfo.coupon.filter(item =>item.act_id.indexOf(data._id) !== -1 && ((item.creation_timestamp + parseInt(item.shopping.time) * 60 > nowstamp && item.status == 'waiting') || item.status == 'success' || item.status == 'complete') )
      console.log(cou)
      for (let i in data.shopping) {
        for (let u in cou) {
          if (i == cou[u].shopping_ind) {
            data.shopping[i].status = true
            that.setData({
              data: data
            })
          }
        }
      }
    }
    for (let i in data.shopping) {
      wx.cloud.callFunction({
        name: 'phoney'
      }).then(res => {
        let newArr = res.result.sort(() => Math.random() - 0.5);
        data.shopping[i].userList = newArr
        for (let x = 0; x < data.shopping[i].userList.length; x++) {
          if (data.shopping[i].userList[x].name.length > 2) {
            let start = data.shopping[i].userList[x].name.substring(0, 1)
            let end = data.shopping[i].userList[x].name.substring(data.shopping[i].userList[x].name.length - 1)
            data.shopping[i].userList[x].anonymous = start + '***' + end
          } else {
            data.shopping[i].userList[x].anonymous = data.shopping[i].userList[x].name
          }
          if (i + 1 == data.shopping.length && x + 1 == data.shopping[i].userList.length) {
            console.log(data.shopping[i].userList)
            that.setData({
              data: data
            })
          }
        }
        that.setData({
          data: data
        })
      })
    }
    that.setData({
      data: data
    })
    if (data.end_timestamp > nowstamp && nowstamp > data.start_timestamp) {
      that.setData({
        action: 'going'
      })
      let int = setInterval(() => {
        nowstamp = nowstamp + 1;
        if (nowstamp >= data.end_timestamp) {
          that.setData({
            days: '00',
            hours: '00',
            minutes: '00',
            seconds: '00',
            action: 'finish'
          })
          clearInterval(int);
        }
        let surplus = data.end_timestamp - nowstamp;
        that.setTime(surplus);
      }, 1000);
    } else if (data.start_timestamp >= nowstamp) {
      that.setData({
        action: 'not'
      })
      let int = setInterval(() => {
        nowstamp = nowstamp + 1;
        if (nowstamp == data.start_timestamp) {
          clearInterval(int)
          let int2 = setInterval(() => {
            nowstamp = nowstamp + 1;
            if (that.data.action == 'not') {
              that.setData({
                action: 'going'
              })
            }
            if (nowstamp >= that.data.data.end_timestamp) {
              that.setData({
                days: '00',
                hours: '00',
                minutes: '00',
                seconds: '00',
                action: 'finish'
              })
              clearInterval(int2);
            }
            let surplus = that.data.data.end_timestamp - nowstamp;
            that.setTime(surplus);
          }, 1000);
        }
        let surplus = data.start_timestamp - nowstamp;
        that.setTime(surplus);
      }, 1000);
    } else {
      that.setData({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
        action: 'finish'
      })

    }
  },
  setTime: function (surplus) {
    var that = this;
    let days = Math.floor(surplus / (60 * 60 * 24));
    if (days < 10) days = '0' + days;
    let hours = Math.floor((surplus / (60 * 60)) % 24);
    if (hours < 10) hours = '0' + hours;
    let minutes = Math.floor((surplus / 60) % 60);
    if (minutes < 10) minutes = '0' + minutes;
    let seconds = Math.floor((surplus) % 60);
    if (seconds < 10) seconds = '0' + seconds;
    that.setData({
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    })
  },
  //加入拼团
  async joinGroup(e) {
    var that = this;
    if (wx.getStorageSync('userInfo')) {
      let userInfo = wx.getStorageSync('userInfo')
      if (that.data.transfer == false) {
        that.increase('success', 'goGroupSuccess', that.data.waresInd, '', []);
      } else {
        if (share_coupon.team.indexOf(userInfo._openid) !== -1) {
          let team = share_coupon.team;
          let status;
          if (that.data.surplusperson <= 1) {
            status = 'success'
          } else {
            status = 'waiting'
          }
          await that.increase(status, 'goGroupSuccess', share_coupon.shopping_ind, share_coupon.cou_code, team);
          if (status == 'success') {
            for (let i in team) {
              that.sendMessage(team[i]._openid, share_coupon.shopping.name, '拼团成功', that.data.data.shop[0].shop_name);
            }
          }
          wx.cloud.callFunction({
            name: 'recordUpdate',
            data: {
              collection: 'coupon',
              where: {
                cou_code: share_coupon.cou_code,
                act_id: share_coupon.act_id
              },
              updateData: {
                team: team,
                status: status
              }
            }
          }).then(res => {
            console.log(res)
          })
        } else {
          wx.showToast({
            title: '您已经领取过该优惠券',
            icon: 'none',
          })
        }

      }

    } else {
      this.selectComponent("#authorize").showModal();
      this.retrieval();
    }
  },
  //发起拼团
  launchGroup: function (e) {
    var that = this;
    let ind = e.currentTarget.dataset.index;
    var that = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          if (wx.getStorageSync('userInfo')) {
            wx.requestSubscribeMessage({
              tmplIds: ['Ggdc3CQ1c6V0ss6ZvsMnExScZjPHZ0-8_OFdCJRTubA'],
              success(res) {
                if (JSON.stringify(res).indexOf('accept') !== -1) {
                  that.increase('waiting', 'initiateGroup', ind, '', []);
                }
              }
            })
          } else {
            that.selectComponent("#authorize").showModal();
            that.retrieval();
          }
        } else {
          that.selectComponent("#authorize").showModal();
          that.retrieval();
        }
      }
    })

  },
  getIndex: function (e) {
    let ind = e.detail.current;
    if(this.data.modalName==null){
      this.setData({
        userInd: ind
      })
    }
  },
  sendMessage: function (openid, wares, result, shop) {
    wx.cloud.callFunction({
      name: 'sendMessage',
      data: {
        openid: openid,
        page: 'pages/myCoupon/myCoupon',
        data: {
          "thing2": {
            "value": wares
          },
          "phrase1": {
            "value": result
          },
          "thing3": {
            "value": shop
          },
        },
        templateId: 'Ggdc3CQ1c6V0ss6ZvsMnExScZjPHZ0-8_OFdCJRTubA'
      }
    }).then(res => {})
  },
  //检索是否登陆
  retrieval: function () {
    var that = this;
    let timing = setInterval(() => {
      if (wx.getStorageSync('userInfo')) {
        let userInfo = wx.getStorageSync('userInfo')
        that.setData({
          userInfo: userInfo
        })
        let cou = userInfo.coupon.filter(item => item.act_id.indexOf(that.data.data._id) !== -1)
        let data = that.data.data;
        for (let i in data.shopping) {
          for (let u in cou) {
            if (i == cou[u].shopping_ind) {
              data.shopping[i].status = true
              that.setData({
                data: data
              })
            }
          }
        }
        setTimeout(() => {
          clearInterval(timing);
        }, 900);
      }
    }, 1000);
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
  onUnload: function (e) {

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
  onShareAppMessage: function (res) {
    var that = this;
    let userInfo = wx.getStorageSync('userInfo')
    if (res.from === 'button') {
      console.log(res.from)
      return {
        title: "【仅剩1个名额】我领了100元拼团券，快来助我成团激活~", //分享标题
        imageUrl: 'https://img13.360buyimg.com/ddimg/jfs/t1/160040/27/61/289416/5fe99874E75804776/891b1b08109afc6d.png', //图片路径
        path: 'pages/groupSpecial/groupSpecial?act_id=' + that.data.data._id + '&cou_code=' + that.data.cou_code + '&end_timestamp=' + that.data.data.end_timestamp
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