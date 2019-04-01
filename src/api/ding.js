import request from '@/utils/request'

export function getDingUserInfo(authcode) {
  return request({
    url: '/other/dduser',
    method: 'get',
    params: {
      authcode
    }
  })
}

export function getDingSignature(url) {
  return request({
    url: '/other/ddticket',
    method: 'get',
    params: {
      url
    }
  })
}
