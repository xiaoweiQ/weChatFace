// plugin/pages/idVerification/index.js
const BaseJs = require('../../static/project/base.js')
let plugin = requirePlugin('shargoodata')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    formData: [
      {
        title: '姓名',
        nodeType: 'input',
        type: 'text',
        require: true,
        value: '',
        placeholder: '请输入您的姓名',
        id: 'idName',
        errorTip: '',
        rule: [
          { message: '请填写中文', type: 'chinese' }
        ]
      },
      {
        title: '身份证号',
        nodeType: 'input',
        type: 'idcard',
        require: true,
        value: '',
        placeholder: '请输入身份证号',
        id: 'idNumber',
        isErr: false,
        errorTip: '',
        rule: [
          { message: '请填写正确的身份证号码', type: 'idCard' }
        ]
      }
    ]
  },
  inputChange(e) {
    let index = e.currentTarget.dataset.index
    let formItemValue = 'formData[' + index + '].value'
    this.setData({
      [formItemValue]: e.detail.value
    })
  },
  inputVerify(e) {
    let index = Number(e.currentTarget.dataset.index)
    let value = e.detail.value

    this.verInput(index, value)
  },
  // 失去焦点的时候验证表单
  verInput(index = 0) {
    let errorTip = `formData[${index}].errorTip`
    this.setData({
      [errorTip]: this.errMessage(this.data.formData[index])
    })
  },
  // 根据rule的配置来显示错误
  errMessage(formItem) {
    let message = ''
    if (formItem.require && !formItem.value) return `请填写${formItem.title}`
    try {
      formItem.rule.forEach(item => {
        if (item.type == 'chinese' && !BaseJs.isChinese(formItem.value)) {
          message = item.message
        } else if (item.type == 'email' && !BaseJs.isEmail(formItem.value)) {
          message = item.message
        } else if (item.type == 'phoneNumber' && !BaseJs.isPhoneNumber(formItem.value)) {
          message = item.message
        } else if (item.type == 'idCard' && !BaseJs.isCardNo(formItem.value)) {
          message = item.message
        }
      })
    } catch {}
    return message
  },
  checkForm() {
    for (let i = 0; i < this.data.formData.length; i++) {
      this.verInput(i)
    }
  },
  handleClickNextStep() {
    this.checkForm()
    let isError = false
    this.data.formData.forEach(item => {
      if (item.errorTip !== '') {
        isError = true
      }
    })
    if (!isError) {
      const info = {
        idName: this.data.formData[0].value,
        idNumber: this.data.formData[1].value
      }
      let option = {
        url: BaseJs.getTokenUrl(),
        method: 'POST',
        data: {
          platformNo: BaseJs.getPlatformNo(),
          secretKey: BaseJs.getSecretKey()
        }
      }
      BaseJs.ajaxRequest(option, resJson => {
        plugin.ocrStart({
          platformNo: BaseJs.getPlatformNo(),
          token: resJson.data,
          extraInfo: info,
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
            BaseJs.globalData.successInfo.des = '恭喜您，完成了身份验证'
            BaseJs.globalData.successInfo.data = res
          }
        })
      })
      wx.navigateTo({
        url: 'plugin-private://' + BaseJs.getAppid() + '/pages/face/index'
      })
    }
  }
})
