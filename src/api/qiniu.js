import request from '@/utils/request'
import Cookies from 'js-cookie'

const QnToken = 'QnToken'

export function getQnToken() {
  return Cookies.get(QnToken)
}

export function setQnToken(qiniuToken) {
  let exp = new Date();
  exp.setTime(exp.getTime() + 60 * 15000);
  return Cookies.set(QnToken, qiniuToken, { expires: exp })
}

export function getToken() {
  return request({
    url: '/other/qiniu',
    method: 'get'
  })
}
