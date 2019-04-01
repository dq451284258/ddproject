import Cookies from 'js-cookie'
import store from '@/store'
import { getDingUserInfo, getDingSignature } from '@/api/ding'
import { MessageBox } from 'element-ui'
import { setUserId, setDdcode } from '@/utils/auth'

const Signature = 'Signature'
let udd = DingTalkPC

export function getSignature() {
  return Cookies.get(Signature)
}

export function setSignature(signature) {
  return Cookies.set(Signature, signature, { expires: 0.08 })
}

export function removeSignature() {
  return Cookies.remove(Signature)
}

export function configParams(agentId, corpId, timeStamp, nonceStr, signature) {

  // setTimeout(() => {
  //   store.dispatch('IsReady', { ready: true })
  // }, 2000)

  const jsApiList = [
    'device.notification.alert',
    'device.notification.confirm',
    'device.notification.toast',
    'device.notification.actionSheet',
    'runtime.permission.requestAuthCode',
    'runtime.permission.requestOperateAuthCode',
    'biz.util.previewImage',
    'biz.util.openLink',
    'biz.util.downloadFile',
    'biz.util.openLocalFile',
    'biz.util.uploadImage',
    'biz.ding.post',
    'biz.contact.choose',
    'biz.customContact.choose',
    'biz.customContact.multipleChoose',
    'biz.user.get'
  ]

  udd.config({
    agentId: '199061755', // 必填，微应用ID
    corpId: 'dingef35e6e78a61828f35c2f4657eb6378f',//必填，企业ID
    timeStamp: timeStamp, // 必填，生成签名的时间戳
    nonceStr: nonceStr, // 必填，生成签名的随机串
    signature: signature, // 必填，签名
    jsApiList: jsApiList // 必填，需要使用的jsapi列表
  });

  udd.ready(function(res){
    // console.log('ready:'+res)
    // store.dispatch('IsReady', { ready: true })
    // store.dispatch('GetMessage').then(res => {
    //   console.log(res)
    // })
    dingAuth()
  })

  udd.error(function(error){
    console.log(error)
    store.dispatch('IsReady', { ready: false })
  })
}

export function config() {
  var sUserAgent = navigator.userAgent.toLowerCase();
  var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
  var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
  var bIsMidp = sUserAgent.match(/midp/i) == "midp";
  var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
  var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
  var bIsAndroid = sUserAgent.match(/android/i) == "android";
  var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
  var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
  if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
    MessageBox.alert('请在PC客户端打开应用~', '提示')
    return false
  }
  if(process.env.NODE_ENV === 'development') {
    store.dispatch('IsReady', { ready: true })
    store.dispatch('GetDingUserId')  //生产环境注释
  }else {
    getDingSignature('http://dd.arctron.cn/').then(res => {
      // console.log(res)
      setSignature(res.data.signature)
      store.dispatch('GetDingConfig', {
        agentId: res.data.agentId,
        corpId: res.data.corpId,
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        signature: res.data.signature
      })
      configParams(res.data.agentId, res.data.corpId, res.data.timeStamp, res.data.nonceStr, res.data.signature)
    })
  }
}

export function dingAuth() {
  // store.dispatch('GetDingUserId')
  // store.dispatch('GetDdCode')
  udd.runtime.permission.requestAuthCode({  //钉钉免登
    corpId: "dingef35e6e78a61828f35c2f4657eb6378f", //企业ID
    onSuccess: function(result) {
      // console.log(result)
      store.dispatch('GetDdCode', result.code)
      setDdcode(result.code)
      getDingUserInfo(result.code).then(res => {
        // console.log(res)
        if(res.data.errcode === 0) {
          setUserId(res.data.userid)
          store.dispatch('GetDingUserId', res.data.userid)
          store.dispatch('IsReady', { ready: true })
        }
      })
    },
    onFail : function(err) {
      // console.log(err)
      // Cookies.set('userid', 'ac121638b303adef0023a175a86ffc914b413c335f8cb4d1734fc5db84507f09')
    }
  })
}
