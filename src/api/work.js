import request from '@/utils/request'
//工时填写页
//红绿匹配
export function month(info) {
return request({
    url: '/worktime/month',
    method: 'get',
    params: {
      	userid:info.userid,
        startdate:info.startdate,
        enddate:info.enddate
    }
})
}
//点击日期操作
export function userpro(info) {
return request({
    url: '/worktime/userpro',
    method: 'get',
    params: {
      	userid:info.userid,
        date :info.date, 
    }
})
}
//worktime/useradd 工时-提交工时
export function useradd(info) {
return request({
    url: '/worktime/useradd',
    method: 'post',
    params: { 
        userid:info.userid,
        username:info.username,
        date:info.date,
        type:info.type,
        data:info.data, 
    }
})
}
///worktime/list工时-工时审批列表
export function list(info) {
return request({
    url: '/worktime/list',
    method: 'get',
    params: { 
        approveid:info.approveid,
        type:info.type,
        startdate:info.startdate,
        enddate:info.enddate,
        keyword:info.keyword, 
    }
})
}
//worktime/approve工时-工时审批
export function approve(info) {
return request({
    url: '/worktime/approve',
    method: 'post',
    params: { 
        approveid:info.approveid,
        data:info.data, 
    }
})
}
//worktime/export获取或导出工时的列表
export function exportList(info) {
return request({
    url: '/worktime/export',
    method: 'get',
    params: { 
        user_id:info.user_id,
        type:info.type,
        selected_time:info.selected_time,
        // start_time:info.start_time, 
        // end_time:info.end_time,
        keywords:info.keywords, 
        // page:info.page,
        // limit:info.limit, 
        is_export:info.is_export, 
    }
})
}