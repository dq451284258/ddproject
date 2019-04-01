/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

export function toChinesNum(num){
  let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  let unit = ["", "十", "百", "千", "万"];
  num = parseInt(num);
  let getWan = (temp) => {
    let strArr = temp.toString().split("").reverse();
    let newNum = "";
    for (var i = 0; i < strArr.length; i++) {
      newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : (changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i])) ) ) + newNum;
    }
    return newNum;
  }
  let overWan = Math.floor(num / 10000);
  let noWan = num % 10000;
  if (noWan.toString().length < 4) noWan = "0" + noWan;
  return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
}

export function formatMoney(str) {
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function arrayToString(array) {
  let arr = [], str = ''
  if(array.length) {
    for(let i = 0; i < array.length; i ++){
      arr.push(array[i].id)
    }
    str = arr.join(',')
  }
  return str
}

export function stringToArray(string) {
  let arr = []
  if(string.length) {
    if(string.indexOf(',') !== -1) {
      for(let i = 0; i < string.split(',').length; i ++) {
        arr.push({
          name: '',
          avatar: '',
          id: string.split(',')[i],
          days: 0
        })
      }
    }else {
      arr.push({
        name: '',
        avatar: '',
        id: string,
        days: 0
      })
    }
  }
  return arr
}

export function filesToArray(string) {
  let splitstr = (str) => {
    return {
      name: str.split('?')[1].split('=')[1],
      url: str.split('?')[0]
    }
  }
  let arr = []
  if(string.indexOf(',') !== -1) {
    for(let i = 0; i < string.split(',').length; i ++) {
      arr.push(splitstr(string.split(',')[i]))
    }
  }else {
    arr.push(splitstr(string))
  }
  return arr
}

export function formatTime(time, fmt) {
  if(!time) {
    return ''
  }else {
    let _time = new Date(time)
    var o = {
      "M+": _time.getMonth() + 1, //月份
      "d+": _time.getDate(), //日
      "h+": _time.getHours(), //小时
      "m+": _time.getMinutes(), //分
      "s+": _time.getSeconds(), //秒
      "q+": Math.floor((_time.getMonth() + 3) / 3), //季度
      "S": _time.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (_time.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
}

export function getTimeArray(start, end) {
  let s = start.split('-')[1]
  let e = end.split('-')[1]
  let sy = start.split('-')[0]
  let ey = end.split('-')[0]
  let m = []
  if(sy === ey) {
    if(parseInt(e) === parseInt(s)) {
      let mon = parseInt(s) < 10 ? '0'+parseInt(s).toString() : parseInt(s).toString()
      let str = sy.toString() + mon
      m.push(str)
    }else {
      for(let i = 0; i < parseInt(e) - parseInt(s)+1; i ++) {
        let mon = parseInt(s)+i < 10 ? '0'+(parseInt(s)+i).toString() : (parseInt(s)+i).toString()
        let str = sy.toString() + mon
        m.push(str)
      }
    }
  }else if(parseInt(ey) - parseInt(sy) > 1) {
    let es = parseInt(ey) - parseInt(sy)
    let b = [], a = [], c = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'], d = []
    for(let i = 0; i < 13 - parseInt(s); i ++) {
      let mon = parseInt(s)+i < 10 ? '0'+(parseInt(s)+i).toString() : (parseInt(s)+i).toString()
      let str = sy.toString() + mon
      b.push(str)
    }
    for(let i = 0; i < es-1; i ++) {
      let arr = []
      for(let l = 0; l < 12; l ++) {
        arr.push( (parseInt(sy)+i+1).toString()+c[l] )
      }
      d = d.concat(arr)
    }
    for(let i = 0; i < parseInt(e) - 0; i ++) {
      let mon = i+1 < 10 ? '0'+(i+1).toString() : (i+1).toString()
      let str = ey.toString() + mon
      a.push(str)
    }
    m = b.concat(d).concat(a)
  }else {
    let b = [], a = []
    for(let i = 0; i < 13 - parseInt(s); i ++) {
      let mon = parseInt(s)+i < 10 ? '0'+(parseInt(s)+i).toString() : (parseInt(s)+i).toString()
      let str = sy.toString() + mon
      b.push(str)
    }
    for(let i = 0; i < parseInt(e) - 0; i ++) {
      let mon = i+1 < 10 ? '0'+(i+1).toString() : (i+1).toString()
      let str = ey.toString() + mon
      a.push(str)
    }
    m = b.concat(a)
  }
  return m
}

export function arrayFilterRe(arr) {
  let newArr = []
  for(let i = 0; i < arr.length; i ++) {
    for (let j = i+1; j < arr.length; j++) {
      if(arr[i].id === arr[j].id){
        ++i;
      }
    }
    newArr.push(arr[i])
  }
  return newArr
}
