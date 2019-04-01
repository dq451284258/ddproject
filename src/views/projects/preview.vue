<template>
  <div class="preview">
    <div class="content">
      <back-link />
      <div class="body">
        <el-form ref="form" :label-position="labelPosition" :model="projectForm" label-width="122px" size="small">
          <div class="raw">
            <div class="raw-content">
              <el-form-item label="系统编号:" class="readonly-text">
                <p><span>{{ projectForm.number }}</span></p>
              </el-form-item>
              <el-form-item label="项目名称:" class="readonly-text">
                <p><span>{{ projectForm.name }}</span></p>
              </el-form-item>
              <el-form-item label="业主名称:" class="readonly-text">
                <p><span>{{ projectForm.ownerName }}</span></p>
              </el-form-item>
              <el-form-item label="计划开始时间:" class="readonly-text">
                <p><span>{{ projectForm.projStartTime }}</span></p>
              </el-form-item>
              <el-form-item label="计划结束时间:" class="readonly-text">
                <p><span>{{ projectForm.projEndTime }}</span></p>
              </el-form-item>
              <el-form-item label="项目预算:" class="readonly-text">
                <p><span>{{ projectForm.budget }}元</span></p>
              </el-form-item>
              <el-form-item label="预算工时合计:" class="readonly-text">
                <p><span>{{ projectForm.stageNum }}人天 ( {{ projectForm.stageNum*8 }}小时 )</span></p>
              </el-form-item>
              <el-form-item label="项目简介:" class="readonly-text">
                <p><span>{{ projectForm.desc }}</span></p>
              </el-form-item>
              <el-form-item label="项目成员:">
                <div class="member-list">
                  <div class="member-list-handle">
                    <div class="title"><span>项目经理</span></div>
                    <div class="members">
                      <member-list-view
                      :doneUserList="projectForm.projManager"
                      @getList="getProjManager"
                      @getAllMembers="getAllMembers"
                      :needClear="false"
                      :needAdd="1"
                      v-if="projectForm.loading" />
                    </div>
                  </div>
                  <div class="member-list-handle">
                    <div class="title"><span>监督人</span></div>
                    <div class="members">
                      <member-list-view
                      :doneUserList="projectForm.supervisor"
                      @getList="getSupervisor"
                      @getAllMembers="getAllMembers"
                      :needClear="false"
                      :needAdd="1"
                      v-if="projectForm.loading" />
                    </div>
                  </div>
                  <div class="member-list-handle">
                    <div class="title"><span>协同部门协作人</span></div>
                    <div class="members">
                      <member-list-view
                      :doneUserList="projectForm.coordination"
                      @getList="getCoordination"
                      @getAllMembers="getAllMembers"
                      :needClear="false"
                      :needAdd="0"
                      v-if="projectForm.loading" />
                    </div>
                  </div>
                  <div class="member-list-handle">
                    <div class="title"><span>其他成员</span></div>
                    <div class="members">
                      <member-list-view
                      :doneUserList="projectForm.others"
                      @getList="getOthers"
                      @getAllMembers="getAllMembers"
                      :needClear="false"
                      :needAdd="1"
                      v-if="projectForm.loading" />
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="审批流程:" class="readonly-text">
                <div class="process-list">
                  <div class="process-item" v-for="(p, index) in projectForm.process" :key="index">
                    <div class="process-avatar">
                      <memberView :id="p.userid" :showName="false" @getName="setName" :index="index" />
                      <div class="line"></div>
                    </div>
                    <div class="process-detail">
                      <div class="top">
                        <div class="">
                          <span class="name">{{ p.name }}</span>
                          <span class="status" :class="{'agree': p.result === 'AGREE', 'refuse': p.result === 'REFUSE'}">{{ p.result | getRes(index) }}</span>
                          <span class="status">{{ p.type | getType(index) }}</span>
                        </div>
                        <span class="date">{{ p.date }}</span>
                      </div>
                      <div class="bot">
                        <p><span>{{ p.desc }}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import NProgress from 'nprogress'
  import backLink from '@/components/backLink'
  import memberListView from '@/components/memberListView'
  import memberWorkListView from '@/components/memberWorkListView'
  import { toChinesNum, formatMoney, formatTime, stringToArray, filesToArray, getTimeArray } from '@/utils/validate'
  import { getDetail, projectEdit, projectSubmit, getProcess } from '@/api/project'
  import uploadFile from '@/components/uploadFile'
  import memberView from '@/components/memberView'

  export default {
    name: 'preview',
    data() {
      return {
        projectForm: {
          id: this.$route.params.id,
          //项目
          number: '',
          projType: '',
          projTypeList: [
            '预立项生产性项目', '正式立项生产性项目', '募投项目', '内部管理', '科研项目', '事务型',
          ],
          name: '',
          beforeNum: '',
          projNum: '',
          ownerName: '',
          doneUserList: [{
            id: this.$store.getters.userid,
            days: 0,
            name: '',
            avatar: ''
          }],
          projManager: [],
          supervisor: [],
          coordination: [],
          others: [],
          allMembers: [],
          desc: '',
          projStart: '',
          projEnd: '',
          projStartTime: '',
          projEndTime: '',
          //工时
          memberCost: 0,
          stage: [{
            start: '',
            end: '',
            time: '',
            days: 0,
            desc: '',
            price: '',
            members: [],
            month: []
          }],
          stageNum: 0,
          //预算
          budget: '',
          purchase: '',
          purchaseScale: '',
          costTable: [
            {
              title: '业务招待',
              emb: '业务招待',
              desc: '',
              price: '',
              num: '',
              money: '',
              scale: ''
            }, {
              title: '市内交通',
              emb: '差旅交通',
              desc: '',
              price: '',
              num: '',
              money: '',
              scale: ''
            }, {
              title: '外埠差旅',
              emb: '差旅交通',
              desc: '',
              price: '',
              num: '',
              money: '',
              scale: ''
            }, {
              title: '误餐费',
              emb: '差旅交通',
              desc: '',
              price: '',
              num: '',
              money: '',
              scale: ''
            }, {
              title: '翻译费',
              emb: '业务费',
              desc: '',
              price: '',
              num: '',
              money: '',
              scale: ''
            }, {
              title: '文印晒图',
              emb: '',
              desc: '',
              price: '',
              num: '',
              money: '',
              scale: ''
            }, {
              title: '业务资料',
              emb: '',
              desc: '',
              price: '',
              num: '',
              money: '',
              scale: ''
            }, {
              title: '会务费',
              emb: '',
              desc: '',
              price: '',
              num: '',
              money: '',
              scale: ''
            }, {
              title: '劳务费',
              emb: '专家咨询',
              desc: '',
              price: '',
              num: '',
              money: '',
              scale: ''
            }, {
              title: '邮费快递',
              emb: '办公费',
              desc: '',
              price: '',
              num: '',
              money: '',
              scale: ''
            }, {
              title: '资产采购',
              emb: '',
              desc: '',
              price: '',
              num: '',
              money: '',
              scale: ''
            }, {
              title: '通讯补贴',
              emb: '',
              desc: '',
              price: '',
              num: '',
              money: '',
              scale: ''
            }, {
              title: '设备租赁',
              emb: '设备租赁',
              desc: '',
              price: '',
              num: '',
              money: '',
              scale: ''
            }, {
              title: '其他',
              emb: '汽油费',
              desc: '',
              price: '',
              num: '',
              money: '',
              scale: ''
            }
          ],
          total: '',
          files: [],
          loading: false,
          process: []
        },
        labelPosition: 'right',
        userid: this.$store.getters.userid,
        saveLoading: false,
        submitLoading: false
      }
    },
    mounted() {
      NProgress.done()
      this.getDetail()
    },
    components: {
      backLink,
      memberListView,
      memberWorkListView,
      uploadFile,
      memberView
    },
    watch: {
      $route() {
        NProgress.done()
        Object.assign(this.$data, this.$options.data())
        this.getDetail()
      },
      "projectForm.allMembers"(val) {
        let arr = []
        for(let m = 0; m < this.projectForm.stage.length; m ++) {
          let mem = []
          for(let o = 0; o < this.projectForm.stage[m].month.length; o ++) {
            let oarr = []
            for(let i = 0; i < val.length; i ++) {
              let item = {}
              item = {
                id: val[i].id,
                days: val[i].days,
                name: val[i].name,
                avatar: val[i].avatar
              }
              for(let s = 0; s < this.projectForm.stage[m].month[o].members.length; s ++) {
                if(this.projectForm.stage[m].month[o].members[s].id === val[i].id) {
                  item.days = this.projectForm.stage[m].month[o].members[s].days
                }
              }
              oarr.push(item)
            }
            this.projectForm.stage[m].month[o].members = oarr
          }
        }
        this.getSatgeDays()
        // console.log(this.projectForm.stage)
      }
    },
    methods: {
      getDoneUserList(array) { //操作人
        this.projectForm.doneUserList = [...array]
      },
      getProjManager(array) { //项目经理
        this.projectForm.projManager = [...array]
      },
      getSupervisor(array) { //监督人
        this.projectForm.supervisor = [...array]
      },
      getCoordination(array) { //协同部门协作人
        this.projectForm.coordination = [...array]
      },
      getOthers(array) { //其他成员
        this.projectForm.others = [...array]
      },
      getWorkList(array, index, pindex) { //工时阶段成员
        this.projectForm.stage[index].month[pindex].members = [...array]
        this.getSatgeDays()
      },
      getAllMembers() {
        const arr = this.projectForm.projManager.concat(this.projectForm.coordination).concat(this.projectForm.others)
        let newArr = []
        for(let i = 0; i < arr.length; i ++) {
          let item
          item = {
            id: arr[i].id,
            days: arr[i].days,
            name: arr[i].name,
            avatar: arr[i].avatar
          }
          // for(let m = 0; m < this.projectForm.allMembers.length; m ++) {
          //   if(this.projectForm.allMembers[m].id === arr[i]) {
          //     item.days = this.projectForm.allMembers[m].days
          //   }
          // }
          newArr.push(item)
        }
        this.projectForm.allMembers = newArr
        // console.log(this.projectForm.allMembers)
      },
      changeProjType(e) {
        this.projectForm.stage = [{
          start: '',
          end: '',
          time: '',
          days: 0,
          desc: '',
          price: '',
          members: [],
          month: []
        }]
        this.projectForm.stageNum = 0
      },
      addStage() {
        const arr = this.projectForm.projManager.concat(this.projectForm.coordination).concat(this.projectForm.others)
        let newArr = []
        for(let i = 0; i < arr.length; i ++) {
          let item
          item = {
            id: arr[i].id,
            days: 0,
            name: arr[i].name,
            avatar: arr[i].avatar
          }
          newArr.push(item)
        }
        this.projectForm.stage.push({
          start: '',
          end: '',
          time: '',
          days: 0,
          desc: '',
          price: '',
          members: newArr,
          month: []
        })
      },
      clearStage(index) {
        this.projectForm.stage.splice(index, 1)
        this.getSatgeDays()
      },
      toZh(num) {
        return toChinesNum(num)
      },
      getSatgeDays() {
        const list = this.projectForm.stage;
        let Num = 0;
        for(let i = 0; i < list.length; i ++) {
          for(let m = 0; m < list[i].month.length; m ++) {
            for(let o = 0; o < list[i].month[m].members.length; o ++) {
              Num += parseInt(list[i].month[m].members[o].days)
            }
          }
        }
        this.projectForm.stageNum = Num
      },
      getStageTime(index) {
        const timeArr = this.projectForm.stage[index].time
        this.projectForm.stage[index].start = formatTime(timeArr[0], 'yyyy-MM-dd')
        this.projectForm.stage[index].end = formatTime(timeArr[1], 'yyyy-MM-dd')
        let time = []
        if(this.projectForm.projType === 1) {
          time = ['-1']
        }else {
          time = getTimeArray(this.projectForm.stage[index].start, this.projectForm.stage[index].end)
        }
        // console.log(time)
        let arr = []
        for(let i = 0; i < time.length; i ++) {
          arr.push({
            m: time[i],
            days: 0,
            desc: '',
            members: []
          })
        }
        this.projectForm.stage[index].month = arr
        this.getSatgeDays()
        this.getAllMembers()
      },
      getTimeAuto(type) {
        if(type === 'start') {
          this.projectForm.projStart = formatTime(this.projectForm.projStartTime, 'yyyy-MM-dd')
        }else {
          this.projectForm.projEnd = formatTime(this.projectForm.projEndTime, 'yyyy-MM-dd')
        }
      },
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if(columnIndex === 1) {
          if(rowIndex === 1) {
            return [3, 1]
          }else if(rowIndex === 4) {
            return [4, 1]
          }else if(rowIndex === 9) {
            return [3, 1]
          }else if(rowIndex === 0 || rowIndex === 8 || rowIndex === 12 || rowIndex === 13) {
            return [1, 1]
          }else {
            return [0, 0]
          }
        }
      },
      getMoney(index, row) {
        if(row.price && row.num) {
          this.projectForm.costTable[index].money = parseFloat(row.price) * parseFloat(row.num)
        }
        const list = this.projectForm.costTable
        this.projectForm.total = 0
        for(let i = 0; i < list.length; i ++) {
          let m = list[i].money
          if(!m) {
            m = 0
          }
          this.projectForm.total += parseFloat(m)
        }
      },
      setName(name, index) {
        this.projectForm.process[index].name = name
      },
      getDetail() {
        getDetail(this.$route.params.id).then(res => {
          // console.log(res)
          if(this.$route.params.id == 0) {
            this.projectForm.number = res.data.base.sys_num
          }else {
            this.projectForm.id = res.data.base.id
            this.projectForm.number = res.data.base.sys_num
            this.projectForm.projType = res.data.base.type
            this.projectForm.name = res.data.base.name
            this.projectForm.beforeNum = res.data.base.advance_pro_num
            this.projectForm.projNum = res.data.base.pro_num
            this.projectForm.ownerName = res.data.base.owner_name
            this.projectForm.doneUserList = stringToArray(res.data.base.creator)
            this.projectForm.projManager = stringToArray(res.data.base.manager)
            this.projectForm.supervisor = stringToArray(res.data.base.supervisor)
            this.projectForm.coordination = stringToArray(res.data.base.cooperator)
            this.projectForm.others = stringToArray(res.data.base.members)
            this.projectForm.desc = res.data.base.comment
            this.projectForm.projStart = res.data.base.starttime
            this.projectForm.projStartTime = res.data.base.starttime
            this.projectForm.projEnd = res.data.base.endtime
            this.projectForm.projEndTime = res.data.base.endtime
            let step = []
            // console.log(res.data.step)
            for(let i = 0; i < res.data.step.length; i ++) {
              let mon = []
              for(let p in res.data.step[i].member_worktime) {
                let mem = res.data.step[i].member_worktime[p]
                let mList = []
                for(let m in mem.members) {
                  mList.push({
                    id: m,
                    days: mem.members[m],
                    name: '',
                    avatar: ''
                  })
                }
                mon.push({
                  m: p,
                  days: mem.days,
                  desc: mem.desc,
                  members: mList
                })
              }
              step.push({
                start: res.data.step[i].starttime,
                end: res.data.step[i].endtime,
                time: [res.data.step[i].starttime, res.data.step[i].endtime],
                days: res.data.step[i].step_days,
                desc: res.data.step[i].comment,
                price: res.data.step[i].step_price,
                members: [],
                month: mon
              })
            }
            this.projectForm.stage = step
            this.projectForm.budget = res.data.base.budget
            this.projectForm.purchase = res.data.base.buy
            this.projectForm.purchaseScale = res.data.base.buy_rate
            let cost = JSON.parse(res.data.base.cost)
            this.projectForm.costTable = cost.business.table
            this.projectForm.total = cost.business.total
            this.projectForm.files = res.data.base.files ? filesToArray(res.data.base.files) : []
          }
          this.projectForm.loading = true
          this.getSatgeDays()
          // console.log(this.projectForm.stage)
        }).catch(error => {
          console.log(error)
        })
        getProcess(this.projectForm.id, 1).then(res => {
          // console.log(res)
          if(res.result === 'success') {
            const data = res.data.approval_record
            let arr = []
            for(let i = 0; i < data.length; i ++) {
              arr.push({
                date: data[i].date,
                userid: data[i].userid,
                desc: data[i].remark ? data[i].remark : '',
                type: data[i].operation_type,
                result: data[i].operation_result,
                name: ''
              })
            }
            this.projectForm.process = arr
          }
        })
      },
      save() {
        this.beforeSave().then(res => {
          this.saveLoading = true
          projectEdit(this.projectForm).then(res => {
            // console.log(res)
            this.saveLoading = false
            if(res.result === 'success') {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              // this.projectForm.id = res.data.proj_id
              this.$router.push('/')
            }else {
              this.$message({
                message: res.data.errmsg,
                type: 'info'
              })
            }
          }).catch(error => {
            console.log(error)
          })
        })
      },
      beforeSave() {
        return new Promise((resolve, reject) => {
          const form = this.projectForm
          if(!form.number || !form.projType || !form.name || !form.projStart || !form.projEnd) {
            this.$message({
              message: '请补全项目基本信息',
              type: 'info'
            })
            return false
          }
          if(form.projType === 0) {
            if(!form.beforeNum) {
              this.$message({
                message: '请补全项目基本信息',
                type: 'info'
              })
              return false
            }
          }
          if(!form.doneUserList.length || !form.projManager.length || !form.supervisor.length || !form.coordination.length || !form.others.length) {
            this.$message({
              message: '请补全项目成员信息',
              type: 'info'
            })
            return false
          }
          for(let i = 0; i < form.stage.length; i ++) {
            if(!form.stage[i].start || !form.stage[i].end || !form.stage[i].days) {
              this.$message({
                message: '请补工时信息',
                type: 'info'
              })
              return false
            }
          }
          if(!form.budget) {
            this.$message({
              message: '请补全预算信息',
              type: 'info'
            })
            return false
          }
          resolve(true)
        })
      },
      submit() {
        this.submitLoading = true
        this.beforeSave().then(res => {
          projectEdit(this.projectForm).then(res => {
            if(res.result === 'success') {
              projectSubmit(res.data.proj_id).then(res => {
                this.submitLoading = false
                if(res.result === 'success') {
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  })
                  this.$router.push('/')
                }else {
                  this.$message({
                    message: res.data.errmsg,
                    type: 'info'
                  })
                }
              }).catch(error => {
                this.submitLoading = false
              })
            }else {
              this.$message({
                message: res.data.errmsg,
                type: 'info'
              })
              this.submitLoading = false
            }
          }).catch(error => {
            this.submitLoading = false
          })
        }).catch(error => {
          this.submitLoading = false
        })
      },
      addFiles(files) {
        this.projectForm.files = files
      }
    },
    filters: {
      formatNum(str) {
        return formatMoney(str.toString())
      },
      getRes(str, index) {
        let res = ''
        if(str === 'AGREE') {
          res = '已同意'
        }else if(str === 'REFUSE') {
          res = '已拒绝'
        }else {
          res = ''
        }
        return res
      },
      getType(str, index) {
        let res = ''
        if(str === 'START_PROCESS_INSTANCE') {
          res = '发起审批'
        }else if(str === 'REDIRECT_TASK') {
          res = '转交审批'
        }else if(str === 'RUNNING') {
          res = '审批中'
        }else if(str === 'EXECUTE_TASK_NORMAL') {
          res = ''
        }else if(str === 'NEW') {
          res = '待审批'
        }else if(str === 'TERMINATE_PROCESS_INSTANCE') {
          res = '审批终止'
        }else {
          res = '添加评论'
        }
        return res
      }
    }
  }
</script>

<style lang='less'>
  .preview {
    .content {
      .body {
        padding: 0 20px;
        .raw {
          border-top: 1px solid #e6e5e6;
          &:first-child {
            border: none;
          }
          .raw-head {
            h5 {
              margin: 0;
              padding: 18px 0;
            }
          }
          .raw-content {
            padding: 20px 60px 40px 60px;
            .process-list {
              .process-item {
                display: flex;
                justify-content: space-between;
                min-height: 80px;
                .process-avatar {
                  margin-top: -10px;
                  position: relative;
                  display: flex;
                  flex-direction: column;
                  .line {
                    flex-grow: 1;
                    position: relative;
                    &::before {
                      content: '';
                      position: absolute;
                      border-left: 1px dashed #666;
                      width: 1px;
                      top: 0;
                      bottom: 0;
                      left: 50%;
                    }
                  }
                }
                &:last-child {
                  .process-avatar .line{
                    display: none;
                  }
                }
                .process-detail {
                  flex-grow: 1;
                  margin-left: 20px;
                  padding-top: 15px;
                  .top {
                    display: flex;
                    justify-content: space-between;
                    line-height: 20px;
                    .name {
                      color: #222;
                      font-size: 14px;
                    }
                    .status {
                      color: #777;
                      font-size: 14px;
                      margin-left: 10px;
                      &.agree {
                        color: #008cee;
                      }
                      &.refuse {
                        color: #ff4234
                      }
                    }
                    .date {
                      font-size: 12px;
                      color: #666;
                    }
                  }
                  .bot {
                    color: #777;
                    font-size: 14px;
                  }
                }
              }
            }
            .readonly-text {
              p {
                margin: 0
              }
            }
            .input-after {
              margin-left: 10px;
            }
            .proj-stage-add {
              .stage-add-btn {
                width: 154px;
                height: 32px;
              }
            }
            .width-small {
              width: 160px;
              margin-right: 100px;
              position: relative;
              &.scale::after {
                content: '%';
                position: absolute;
                right: -20px;
              }
            }
            .cost-table {
              input {
                border: none;
              }
            }
            .el-form-button {
              margin-top: 20px;
              button {
                width: 154px;
                height: 40px;
              }
            }
            .flex-style {
              .el-form-item__content {
                display: flex;
                justify-content: space-between;
                .el-select {
                  flex-grow: 1;
                }
              }
              &.left {
                .el-form-item__content {
                  justify-content: flex-start!important;
                  position: relative;
                  .el-form-item__label {
                    width: 70px!important;
                  }
                  .el-form-item__content {
                    margin-left: 70px!important;
                  }
                  .clear-stage {
                    position: absolute;
                    right: 0;
                    padding-top: 4px;
                    cursor: pointer;
                    i {
                      font-size: 24px;
                    }
                  }
                }
              }
            }
            .member-list {
              .member-list-handle {
                .title {
                  color: #777;
                }
              }
            }
          }
        }
      }
    }
  }
</style>

