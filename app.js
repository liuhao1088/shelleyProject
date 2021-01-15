//app.js
App({
  onLaunch: function () {
    wx.hideTabBar();
    this.getSystemInfo();
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cnlight-1gn7d20g2cef1b76',
        traceUser: true,
      })
      var that=this;
      wx.cloud.callFunction({
        name: 'login'
      }).then(res =>{
        console.log(res)
        that.globalData.openid=res.result.openid;
      })
      wx.getSystemInfo({
        success: e => {
          this.globalData.StatusBar = e.statusBarHeight;
          let capsule = wx.getMenuButtonBoundingClientRect();
      if (capsule) {
         this.globalData.Custom = capsule;
        this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
      } else {
        this.globalData.CustomBar = e.statusBarHeight + 50;
      }
        }
      })
    }
    wx.removeStorageSync('refreshData')

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow: function () {
    //隐藏系统tabbar
    wx.hideTabBar();
  },
  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
      }
    });
  },
  editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  globalData: {
    systemInfo:null,
    userInfo: null,
    openid:'',
    prize:'',
    wares:'',
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#979795",
      "selectedColor": "#f92643",
      "list": [
        {
          "pagePath": "/pages/home/home",
          "iconPath": "icon/chanpin-hui.png",
          "selectedIconPath": "icon/chanpin.png",
          "text": "产品"
        },
        {
          "pagePath": "/pages/brandDetails/brandDetails",
          "iconPath": "icon/pinpai-hui.png",
          "selectedIconPath": "icon/pinpai.png",
          "text": "品牌"
        },
        {
          "pagePath": "/pages/index/index",
          "selectedIconPath": "icon/huodong.png",
          "isSpecial": true,
          "text": "活动"
        },
        {
          "pagePath": "/pages/reserveStore/reserveStore",
          "iconPath": "icon/store-hui.png",
          "selectedIconPath": "icon/store.png",
          "text": "门店"
        },
        {
          "pagePath": "/pages/wode/wode",
          "iconPath": "icon/wode-hui.png",
          "selectedIconPath": "icon/wode.png",
          "text": "我的"
        }
      ]
    }
  }
})