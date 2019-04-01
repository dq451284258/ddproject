<template>
  <div class="preview">
    <div class="content">
      <back-link :url="'/'" />
      <div class="body">
        <el-form ref="form" :label-position="labelPosition" :model="projectForm" label-width="122px" size="small">
          <div class="raw">
            <div class="raw-head">
              <h5><strong>分包合同信息</strong></h5>
            </div>
            <div class="raw-content">
              <div class="search-handle">
                <div class="content">
                  <div></div>
                  <el-button type="primary" class="search-btn" :disabled="!canAdd" @click="canAdd && addBuy()">添加采购</el-button>
                </div>
              </div>
              <div class="table-handle">
                <el-table
                  :data="tableData"
                  border
                  style="width: 100%"
                  v-loading="tableLoading">
                  <el-table-column
                    fixed
                    prop="name"
                    label="合同名称"
                    width="">
                  </el-table-column>
                  <el-table-column
                    prop="content"
                    label="采购内容"
                    width="">
                  </el-table-column>
                  <el-table-column
                    prop="money"
                    label="总金额(元)"
                    width="">
                  </el-table-column>
                  <el-table-column
                    prop=""
                    :label="s.label"
                    width=""
                    v-for="(s, index) in labels" :key="index">
                    <template slot-scope="scope">
                      <span>{{ scope.row.steps[index].money }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stext"
                    label="状态"
                    width="">
                  </el-table-column>
                  <el-table-column
                    prop="files"
                    label="附件"
                    width="">
                    <template slot-scope="scope">
                      <a class="download-span" v-for="(f, index) in scope.row.files" :key="index" :href="f.url" download="true">{{ f.name }}<br /></a>
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="">
                    <template slot-scope="scope">
                      <el-button @click="scope.row.look && look(scope.row.id, scope.row.status)" type="text" size="small" :class="{'useless': !scope.row.look}">查看</el-button>
                      <el-button @click="scope.row.edit && edit(scope.row.id, scope.row.status)" type="text" size="small" :class="{'useless': !scope.row.edit}">编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
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
  import { getDetail, projectEdit, projectSubmit, getProcess, buylist } from '@/api/project'
  import uploadFile from '@/components/uploadFile'
  import memberView from '@/components/memberView'

  export default {
    name: 'preview',
    data() {
      return {
        tableData: [],
        canAdd: false,
        labels: [],
        statusTable: ['', '待填写', '审批中', '拒绝', '进行中'],
        tableLoading: false,
        activeTable: true,
        projectForm: {
          id: this.$route.params.id,
          //项目
          number: '',
          projType: '',
          status: '',
          projTypeList: [
            '预立项生产性项目', '正式立项生产性项目', '募投项目', '内部管理', '科研项目', '事务型',
          ],
          name: '',
          beforeNum: '',
          projNum: '',
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
          process: [],
          contract: {
            num: 0,
            scale: 0,
            money: 0,
            result: []
          }
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
      look() {
        let id = this.projectForm.id
        this.$router.push('/aproval/'+id)
      },
      edit(id, status) {
        this.$router.push('/preview/'+this.projectForm.id+'/buy/'+id)
      },
      addBuy() {
        this.$router.push('/preview/'+this.projectForm.id+'/buy/0')
      },
      getBuylist() {
        buylist(this.projectForm.id).then(res => {
          if(res.result === 'success') {
            const list = res.data.list
            this.canAdd = res.data.is_addable
            let arr = []
            arr.push({
              name: '合同额',
              content: '',
              money: this.projectForm.contract.num,
              status: '',
              stext: '',
              id: '',
              steps: this.projectForm.contract.result,
              look: false,
              edit: false,
              files: []
            })
            for(let l in list) {
              let carr = [], cnum = 0
              for(let c in list[l].content) {
                carr.push({
                  label: '第'+toChinesNum(cnum+1)+'阶段'+'('+list[l].content_format[c].starttime+' ~ '+list[l].content_format[c].endtime+')金额明细(元)',
                  money: list[l].content[c]
                })
                cnum += 1
              }
              arr.push({
                name: list[l].name,
                content: list[l].type == '1' ? '劳务' : '采购',
                money: list[l].price,
                status: list[l].status,
                stext: this.statusTable[list[l].status],
                id: list[l].id,
                steps: carr,
                look: list[l].action.is_viewable,
                edit: list[l].action.is_editable,
                files: list[l].files ? filesToArray(list[l].files) : []
              })
            }
            this.tableData = arr
            this.tableLoading = false
          }
        })
      },
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
        this.tableLoading = true
        getDetail(this.$route.params.id).then(res => {
          // console.log(res)
          if(this.$route.params.id == 0) {
            this.projectForm.number = res.data.base.sys_num
          }else {
            this.projectForm.id = res.data.base.id
            this.projectForm.number = res.data.base.sys_num
            this.projectForm.projType = res.data.base.type
            this.projectForm.status = res.data.base.status
            this.projectForm.name = res.data.base.name
            this.projectForm.beforeNum = res.data.base.advance_pro_num
            this.projectForm.projNum = res.data.base.pro_num
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
                month: mon,
                label: '第'+toChinesNum(i+1)+'阶段'+'('+res.data.step[i].starttime+' ~ '+res.data.step[i].endtime+')金额明细(元)',
                id: res.data.step[i].id
              })
              this.projectForm.contract.result.push({
                label: '第'+toChinesNum(i+1)+'阶段'+'('+res.data.step[i].starttime+' ~ '+res.data.step[i].endtime+')金额明细(元)',
                money: res.data.step[i].step_price
              })
            }
            this.projectForm.stage = step
            this.labels = step
            this.projectForm.budget = res.data.base.budget
            this.projectForm.purchase = res.data.base.buy
            this.projectForm.purchaseScale = res.data.base.buy_rate
            let cost = JSON.parse(res.data.base.cost)
            this.projectForm.costTable = cost.business.table
            this.projectForm.total = cost.business.total
            this.projectForm.files = res.data.base.files ? filesToArray(res.data.base.files) : []
            this.projectForm.contract.money = parseFloat(parseFloat(res.data.contract.price)/(1+ parseFloat(res.data.contract.rate)/100)).toFixed(2)
            this.projectForm.contract.scale = res.data.contract.rate
            this.projectForm.contract.num = res.data.contract.price
          }
          this.projectForm.loading = true
          this.getSatgeDays()
          this.getBuylist()
          // console.log(this.projectForm.stage)
        }).catch(error => {
          console.log(error)
        })
      },
      save() {
        this.beforeSave().then(res => {
          this.saveLoading = true
          projectEdit(this.projectForm).then(res => {
            // console.log(res)
            if(res.result === 'success') {
              this.saveLoading = false
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              // this.projectForm.id = res.data.proj_id
              this.$router.push('/')
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
            projectSubmit(res.data.proj_id).then(res => {
              this.submitLoading = false
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$router.push('/')
            }).catch(error => {
              this.submitLoading = false
            })
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
        }else if(index === 0) {
          res = '发起申请'
        }else {
          res = ''
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
            .search-handle {
              padding: 10px 0;
              position: relative;
              .content {
                display: flex;
                justify-content: space-between;
                .search-box {
                  width: 250px;
                  &.el-input--small .el-input__icon {
                    height: 32px;
                    cursor: pointer;
                  }
                }
                .search-btn {
                  width: 136px;
                  padding: 8px 20px;
                }
              }
            }
            .table-handle {
              padding: 20px 0;
              position: relative;
              .el-table--border th {
                background-color: #e6e5e6;
              }
              .el-table thead {
                color: #222;
              }
              .useless {
                &.el-button--text {
                  color: #838383;
                }
              }
              .download-span {
                text-decoration: none;
                color: #008cee;
              }
            }
            .file-list {
              margin-left: 10px;
              a {
                margin-right: 10px;
                text-decoration: none;
                span {
                  color: #3296fa;
                }
              }
            }
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

