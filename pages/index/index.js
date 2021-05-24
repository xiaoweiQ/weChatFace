const BaseJs = require('../../static/project/base.js')
let plugin = requirePlugin('shargoodata')

Page({
  onLoad() {
    wx.setEnableDebug({ enableDebug: true })
  },
  verify(e) {
    let type = e.currentTarget.dataset.type
    //获取 access_token
    let option = {
      url: BaseJs.getTokenUrl(),
      method: 'POST',
      data: {
        platformNo: BaseJs.getPlatformNo(),
        secretKey: BaseJs.getSecretKey()
      }
    }
    BaseJs.ajaxRequest(option, resJson => {
      if (type == 'living') {
        plugin.ocrStart({
          platformNo: BaseJs.getPlatformNo(),
          token: resJson.data,
          extraInfo: {
            isShowCamera: true // 这里的布尔值可以用后端数据库控制，审核通过后，把他变为true即可正常显示
          },
          url: '/pages/result/index',
          success: (res) => {
            console.log(res)
            BaseJs.globalData.successInfo.title = '识别成功',
            BaseJs.globalData.successInfo.des = '恭喜您，完成了人脸识别'
            BaseJs.globalData.successInfo.data = res
          }
        })
        wx.navigateTo({
          url: 'plugin-private://' + BaseJs.getAppid() + '/pages/face/index'
        })
      } else if (type == 'identity') {
        wx.navigateTo({
          url: '/pages/idVerification/index'
        })
      } else if (type === 'identityIdCard') {
        plugin.ocrStart({
          platformNo: BaseJs.getPlatformNo(),
          token: resJson.data,
          extraInfo: {
            isShowCamera: true // 这里的布尔值可以用后端数据库控制，审核通过后，把他变为true即可正常显示
          },
          url: 'plugin-private://' + BaseJs.getAppid() + '/pages/face/index',
          success: (res) => {
            if (JSON.parse(res).success) {
              // 调用身份验证另一个插件
              let name = ''
              let idCard = ''
              JSON.parse(res).data.data.forEach(item => {
                if (item.title == '姓名') {
                  name = item.value
                }
                if (item.title == '身份证号') {
                  idCard = item.value
                }
              })
              plugin.ocrStart({
                platformNo: BaseJs.getPlatformNo(),
                token: resJson.data,
                extraInfo: {
                  idName: name,
                  idNumber: idCard
                },
                url: '/pages/result/index',
                success: res => {
                  console.log(res)
                  setTimeout(() => {
                    wx.showToast({
                      title: JSON.parse(res).data, //提示的内容,
                      icon: 'none', //图标,
                      duration: 2000
                    })
                  }, 1000)
                  BaseJs.globalData.successInfo.title = '认证成功',
                  BaseJs.globalData.successInfo.des = '恭喜您，完成了人脸身份核验'
                  BaseJs.globalData.successInfo.data = res
                }
              })
            } else {
              setTimeout(() => {
                wx.showToast({
                  title: JSON.parse(res).msg,
                  icon: 'none'
                })  
              }, 1000)
            }
          }
        })
        wx.navigateTo({
          url: 'plugin-private://' + BaseJs.getAppid() + '/pages/idCard/index'
        })
      } else if (type === 'idCard') {
        plugin.ocrStart({
          platformNo: BaseJs.getPlatformNo(),
          token: resJson.data,
          url: '/pages/idCardResult/index',
          success: res => {
            if (!JSON.parse(res).success) {
              setTimeout(() => {
                wx.showToast({
                  title: JSON.parse(res).msg,
                  icon: 'none'
                })
              }, 1000)
            } else {
              BaseJs.globalData.ocrResultInfo.data = JSON.parse(res).data
            }
          }
        })
        wx.navigateTo({
          url: 'plugin-private://' + BaseJs.getAppid() + '/pages/idCard/index'
        })
      }
    })
  },
  onShareAppMessage() {}
})
