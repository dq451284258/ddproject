import request from '@/utils/request'

export function getUserInfo(userid) {
  return request({
    url: '/user/info',
    method: 'get',
    params: {
      userid
    }
  })
}

export function getUserListInfo(userids) {
  return request({
    url: '/user/infos',
    method: 'post',
    data: {
      userids
    }
  })
}
