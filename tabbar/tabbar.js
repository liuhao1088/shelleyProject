// tabBarComponent/tabBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {
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
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: app.globalData.systemInfo.model.search('iPhone X') != -1 ? true : false
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
