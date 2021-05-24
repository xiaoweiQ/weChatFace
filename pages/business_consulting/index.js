// miniprogram/pages/business_consulting/index.js
const BaseJs = require('../../static/project/base.js')

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
        id: 'name',
        errorTip: '',
        rule: [
          { message: '请填写中文', type: 'chinese' }
        ]
      },
      {
        title: '手机号码',
        nodeType: 'input',
        require: true,
        type: 'number',
        value: '',
        placeholder: '请输入您的手机号码',
        id: 'tel',
        errorTip: '',
        rule: [
          { message: '请填写正确的手机号码', type: 'phoneNumber' }
        ]
      },
      {
        title: '企业名称',
        nodeType: 'input',
        type: 'text',
        require: true,
        value: '',
        placeholder: '请输入您的企业名称',
        id: 'business',
        errorTip: '',
        rule: [
          { message: '请填写中文', type: 'chinese' }
        ]
      },
      {
        title: '电子邮箱',
        nodeType: 'input',
        type: 'email',
        require: true,
        value: '',
        placeholder: '请输入电子邮箱地址',
        id: 'email',
        errorTip: '',
        rule: [
          { message: '请填写正确的邮箱格式', type: 'email' }
        ]
      },
      {
        title: '部门与职位',
        nodeType: 'input',
        type: 'text',
        require: true,
        value: '',
        placeholder: '请输入部门与职位',
        id: 'department',
        errorTip: '',
        rule: [
          { message: '请填写中文', type: 'chinese' }
        ]
      },
      {
        title: '需求描述',
        nodeType: 'textarea',
        type: 'text',
        require: true,
        value: '',
        placeholder: '请详细描述您需要咨询的内容',
        id: 'description',
        errorTip: ''
      }
    ]
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
  submitForm() {
    this.checkForm()
    let isError = false
    this.data.formData.forEach(item => {
      if (item.errorTip !== '') {
        isError = true
      }
    })
    if (!isError) {
      let options = {
        url: 'http://shargoodata.shargoodata.com/set/sendMsg.json',
        data: {
          name: this.data.formData[0].value,
          phoneNumber: this.data.formData[1].value,
          companyName: this.data.formData[2].value,
          email: this.data.formData[3].value || '',
          job: this.data.formData[4].value || '',
          description: this.data.formData[5].value || ''
        }
      }
      BaseJs.ajaxRequest(options, resJson => {
        if (resJson.success) {
          wx.showToast({
            title: '提交成功',
            success() {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 600)
            }
          })
        } else {
        }
      })
    }
  },
  inputChange(e) {
    let index = e.currentTarget.dataset.index
    let formItemValue = 'formData[' + index + '].value'
    this.setData({
      [formItemValue]: e.detail.value
    })
  }
})
