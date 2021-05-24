const BaseJs = require('../../static/project/base.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    formData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      formData: BaseJs.globalData.ocrResultInfo.data.data,
      frontUrl: BaseJs.globalData.ocrResultInfo.data.imgList[0],
      backUrl: BaseJs.globalData.ocrResultInfo.data.imgList[1]
    })
  },

  nextStep() {
    BaseJs.globalData.successInfo.title = '识别成功'
    BaseJs.globalData.successInfo.des = '恭喜您，完成了身份证识别'
    BaseJs.globalData.successInfo.data = ''
    wx.redirectTo({ url: '/pages/result/index' })
  },

  inputChange(e) {
    const newVal = e.detail.value
    const id = e.currentTarget.dataset.id
    this.data.formData.forEach((item, index) => {
      let data = 'formData[' + index + '].value'
      if (item.id === id) {
        this.setData({
          [data]: newVal
        })
      }
    })
  }
})
