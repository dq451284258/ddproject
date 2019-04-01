export function timechange(dataTime, hms) {
  if (!dataTime) {
    return ''
  };
  var unixTimestamp = new Date(dataTime)

  var year = unixTimestamp.getFullYear()
  var month = unixTimestamp.getMonth() + 1
  var day = unixTimestamp.getDate()
  var hour = unixTimestamp.getHours()
  var min = unixTimestamp.getMinutes()
  var sec = unixTimestamp.getSeconds()
  unixTimestamp.getSeconds()
  if ((month) < 10) {
    month = '0' + month
  }
  if ((day) < 10) {
    day = '0' + day
  }
  if ((hour) < 10) {
    hour = '0' + hour
  }
  if ((min) < 10) {
    min = '0' + min
  }
  if ((sec) < 10) {
    sec = '0' + sec
  }
  if (hms == 'hms') { // 这个是2018530格式
    var traslateTime = year + '' + month + '' + day
  } else if (hms == 'h') { // 2018-5-30 23:59:59
    var traslateTime = year + '-' + month + '-' + day + ' ' + 23 + ':' + 59 + ':' + 59
  } else if (hms == 'hm') { // yymmdd hhmmss
    var traslateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec
  } else if (hms == 's') { // 2018-5-5 00 00 00
    var traslateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec
  } else { // 2018-5-30
    var traslateTime = year + '-' + month + '-' + day
  }


  // return new Date(traslateTime)
  return traslateTime
}
export default timechange
