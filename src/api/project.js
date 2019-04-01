import request from '@/utils/request'
import { arrayToString } from '@/utils/validate'
import store from '@/store'

export function getDetail(id) {
  return request({
    url: '/project/detail/'+id,
    method: 'get',
    params: {
      authcode: store.getters.userid
    }
  })
}

export function projectEdit(form) {
  let step = {}
  for(let i = 0; i < form.stage.length; i ++) {
    let mon = {}
    for(let m = 0; m < form.stage[i].month.length; m ++) {
      let mem = {}
      for(let o = 0; o < form.stage[i].month[m].members.length; o ++) {
        mem[form.stage[i].month[m].members[o].id] = form.stage[i].month[m].members[o].days
      }
      mon[form.stage[i].month[m].m] = {
        "days": form.stage[i].month[m].days,
        "desc": form.stage[i].month[m].desc,
        "price": "",
        "members": mem
      }
    }
    let item = {
      "starttime": form.stage[i].start,
      "endtime": form.stage[i].end,
      "comment": form.stage[i].desc,
      "step_days": form.stage[i].days,
      "step_price": form.stage[i].price,
      "member_worktime": mon
    }
    step[i] = item
  }
  let cost = {
    business: {
      total: form.total,
      table: {}
    },
    buy: {
      total: 0,
      table: {}
    }
  }
  for(let i = 0; i < form.costTable.length; i ++) {
    cost.business.table[i] = form.costTable[i]
  }
  let files = []
  for(let i = 0; i < form.files.length; i ++) {
    files.push(form.files[i].url+'?name='+form.files[i].name)
  }
  let filestr = files.join(',')
  let data = {
    id: form.id,
    req_base: {
      type: form.projType,
      sys_num: form.number,
      pro_num: form.projNum,
      advance_pro_num: form.beforeNum,
      name: form.name,
      creator: form.doneUserList[0].id,
      manager: form.projManager[0].id,
      supervisor: form.supervisor[0].id,
      cooperator: arrayToString(form.coordination),
      members: arrayToString(form.others),
      comment: form.desc,
      starttime: form.projStart,
      endtime: form.projEnd,
      budget: form.budget,
      member_cost: form.memberCost,
      buy: form.purchase,
      buy_rate: form.contract ? (form.contract.money > 0 ? (form.buyTotal*100/form.contract.money).toFixed(2) : 0) : 0,
      cost: cost,
      filestr: filestr,
      owner_name: form.ownerName
    },
    req_step: step,
    authcode: store.getters.userid
  }
  return request({
    url: '/project/edit',
    method: 'post',
    data
  })
}

export function projectEditFormal(form) {
  let step = {}
  for(let i = 0; i < form.stage.length; i ++) {
    let mon = {}
    for(let m = 0; m < form.stage[i].month.length; m ++) {
      let mem = {}
      for(let o = 0; o < form.stage[i].month[m].members.length; o ++) {
        mem[form.stage[i].month[m].members[o].id] = form.stage[i].month[m].members[o].days
      }
      mon[form.stage[i].month[m].m] = {
        "days": form.stage[i].month[m].days,
        "desc": form.stage[i].month[m].desc,
        "price": "",
        "members": mem
      }
    }
    let item = {
      "starttime": form.stage[i].start,
      "endtime": form.stage[i].end,
      "comment": form.stage[i].desc,
      "step_days": form.stage[i].days,
      "step_price": form.stage[i].price,
      "member_worktime": mon
    }
    step[i] = item
  }
  let cost = {
    business: {
      total: form.total,
      table: {}
    },
    buy: {
      total: form.buyTotal,
      table: {}
    }
  }
  for(let i = 0; i < form.costTable.length; i ++) {
    cost.business.table[i] = form.costTable[i]
  }
  for(let i = 0; i < form.buyTable.length; i ++) {
    cost.buy.table[i] = form.buyTable[i]
  }
  let files = []
  for(let i = 0; i < form.files.length; i ++) {
    files.push(form.files[i].url+'?name='+form.files[i].name)
  }
  let filestr = files.join(',')
  let infiles = []
  for(let i = 0; i < form.interestfiles.length; i ++) {
    infiles.push(form.interestfiles[i].url+'?name='+form.interestfiles[i].name)
  }
  let infilestr = infiles.join(',')
  let data = {
    id: form.id,
    req_base: {
      type: form.projType,
      sys_num: form.number,
      pro_num: form.projNum,
      advance_pro_num: form.beforeNum,
      name: form.name,
      creator: form.doneUserList[0].id,
      manager: form.projManager[0].id,
      supervisor: form.supervisor[0].id,
      cooperator: arrayToString(form.coordination),
      members: arrayToString(form.others),
      comment: form.desc,
      starttime: form.projStart,
      endtime: form.projEnd,
      budget: form.budget,
      member_cost: form.memberCost,
      buy: form.purchase,
      buy_rate: form.contract ? (form.contract.money > 0 ? (form.buyTotal*100/form.contract.money).toFixed(2) : 0) : 0,
      cost: cost,
      filestr: filestr,
      owner_name: form.ownerName
    },
    req_step: step,
    authcode: store.getters.userid,
    req_contract: {
      price: form.contract.num,
      rate: form.contract.scale,
      comment: form.interestdesc,
      filestr: infilestr
    },
    authcode: store.getters.userid
  }
  return request({
    url: '/project/edit',
    method: 'post',
    data
  })
}

export function getList(userid, type, k, p, l) {
  return request({
    url: '/project/my',
    method: 'get',
    params: {
      user_id: userid,
      filter_type: type,
      keywords: k,
      page: p,
      limit: l
    }
  })
}

export function projectSubmit(id) {
  return request({
    url: '/approval/prosubmit',
    method: 'post',
    data: {
      id: id,
      authcode: store.getters.userid
    }
  })
}

export function getProcess(id, type) {
  return request({
    url: '/approval/getstatus',
    method: 'get',
    params: {
      param_id: id,
      param_type: type
    }
  })
}

export function editUser(id, members, coor) {
  return request({
    url: '/project/edituser',
    method: 'post',
    data: {
      id: id,
      members: members,
      cooperator: coor,
      authcode: store.getters.userid
    }
  })
}

export function editFiles(id, array) {
  let files = []
  for(let i = 0; i < array.length; i ++) {
    files.push(array[i].url+'?name='+array[i].name)
  }
  let str = files.join(',')
  return request({
    url: '/project/editstep',
    method: 'post',
    data: {
      step_id: id,
      filestr: str,
      authcode: store.getters.userid
    }
  })
}

export function editStatus(id, state, agreement) {
  return request({
    url: '/project/editstatus',
    method: 'post',
    data: {
      id: id,
      state: state,   //1-结束，2-暂停，3-恢复，4-终止
      agreement: agreement,
      authcode: store.getters.userid
    }
  })
}

export function toFormal(id) {
  return request({
    url: '/project/toformal',
    method: 'post',
    data: {
      advance_pro_id: id,
      authcode: store.getters.userid
    }
  })
}

export function buylist(id) {
  return request({
    url: '/project/buylist',
    method: 'get',
    params: {
      pro_id: id,
      authcode: store.getters.userid
    }
  })
}

export function editBuy(id, projid, creator, data) {
  let index = data.list.length - 1
  for(let i = 0; i < data.list.length; i ++) {
    if(data.list[i].id == id) {
      index = i
    }
  }
  let step = data.list[index].step
  let s = {}
  for(let i = 0; i < step.length; i ++) {
    s[step[i].id] = step[i].money
  }
  let files = []
  for(let i = 0; i < data.files.length; i ++) {
    files.push(data.files[i].url+'?name='+data.files[i].name)
  }
  let str = files.join(',')
  let req_data = {
    name: data.list[index].name,
    type: data.type,
    price: data.list[index].money,
    content: s,
    filestr: str
  }
  return request({
    url: '/project/editbuy',
    method: 'post',
    data: {
      id: id,
      pro_id: projid,
      creator: creator,
      req_data: req_data,
      authcode: store.getters.userid
    }
  })
}

export function buySubmit(id) {
  return request({
    url: '/approval/buysubmit',
    method: 'post',
    data: {
      id: id,
      authcode: store.getters.userid
    }
  })
}

export function editProNum(id, pronum, bepronum) {
  return request({
    url: '/project/editpronum',
    method: 'post',
    data: {
      id: id,
      pro_num: pronum,
      advance_pro_num: bepronum,
      authcode: store.getters.userid
    }
  })
}
