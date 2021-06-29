const globalData = {
  isDev: true, //是否为开发版,false是体验版或正式版
  tokenUrl: 'https://gauss.shargoodata.com/gauss/authorization/sdk/getToken.json',
  platformNo: '*****',
  secretKey: '*****',
  successInfo: {
    title: '',
    des: '',
    data: ''
  }
}

const getTokenUrl = function() {
  return globalData.tokenUrl
}
const getSecretKey = function() {
  return globalData.secretKey
}
const getPlatformNo = function() {
  return globalData.platformNo
}

//判断身份证号码
const isCardNo = card => {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (reg.test(card) === false) {
    return false
  } else {
    return true
  }
}

//判断是否中文
const isChinese = str => {
  var reg = /[\u4e00-\u9fa5]/
  return reg.test(str)
}

//判断是否为邮箱
const isEmail = str => {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
  return reg.test(str)
}

//判断是否为手机号
const isPhoneNumber = str => {
  var reg = /^1[3456789]\d{9}$/
  return reg.test(str)
}

//ajax查询
const ajaxRequest = (options = {}, cb) => {
  let url = options.url
  let data = options.data || {}
  let dataType = options.dataType || 'JSON'
  let method = options.method || 'POST'
  let header = options.header || {
    'content-type': 'application/x-www-form-urlencoded'
  }
  wx.request({
    url: url,
    data: data,
    dataType: dataType,
    method: method,
    header: header,
    success: function(res) {
      cb(JSON.parse(res.data))
    }
  })
}

module.exports = {
  ajaxRequest,
  isCardNo,
  isChinese,
  isEmail,
  isPhoneNumber,
  globalData,
  getTokenUrl,
  getSecretKey,
  getPlatformNo
}
