// @ts-check

import Cookies from 'js-cookie'

const UserId = 'userid'

export function getUserId() {
  return Cookies.get(UserId)
}

export function setUserId(userid) {
  return Cookies.set(UserId, userid)
}

export function removeUserId() {
  return Cookies.remove(UserId)
}

const Ddcode = 'ddcode'

export function getDdcode() {
  return Cookies.get(Ddcode)
}

export function setDdcode(ddcode) {
  return Cookies.set(Ddcode, ddcode, { expires: 0.08 })
}

export function removeDdcode() {
  return Cookies.remove(Ddcode)
}
