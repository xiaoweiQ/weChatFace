const BaseJs = require('../../static/project/base.js')

Page({
  data: {
    title: '',
    des: ''
  },
  onLoad() {
    console.log(BaseJs.globalData)
    this.setData({
      title: BaseJs.globalData.successInfo.title,
      des: BaseJs.globalData.successInfo.des
    })
  },
  back() {
    wx.reLaunch({ url: '/pages/index/index' })
  }
})
