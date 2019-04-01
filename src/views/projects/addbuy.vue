<template>
  <div class="addbuy">
    <div class="content">
      <back-link />
      <div class="body">
        <el-form ref="form" label-width="" size="small">
          <div class="raw">
            <div class="raw-content">
              <div class="search-handle">
                <div class="content">
                  <div><span>分包合同</span></div>
                  <div class="">
                    <el-form-item label="采购内容" class="flex-style">
                      <el-select v-model="tableData.type" placeholder="劳务">
                        <el-option :label="p" :value="index+1" v-for="(p, index) in select" :key="index"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="table-handle">
                <el-table
                  :data="tableData.list"
                  border
                  style="width: 100%"
                  :row-class-name="tableRow"
                  v-loading="tableLoading">
                  <el-table-column
                    fixed
                    prop="name"
                    label="合同名称"
                    width="">
                    <template slot-scope="scope">
                      <el-input type="text" v-model="scope.row.name" :readonly="scope.row.read"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed
                    prop="money"
                    label="总金额(元)"
                    width="">
                    <template slot-scope="scope">
                      <el-input type="text" v-model="scope.row.money" :readonly="scope.row.read"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop=""
                    :label="s.label"
                    width=""
                    v-for="(s, index) in tableData.steps" :key="index">
                    <template slot-scope="scope">
                      <el-input type="text" v-model="scope.row.step[index].money" :readonly="scope.row.read"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="status"
                    label="状态"
                    width="">
                  </el-table-column>
                </el-table>
                <el-form-item label="附件">
                  <uploadFile :files="tableData.files" @addFiles='addFiles'/>
                </el-form-item>
                <el-form-item label="">
                  <div class="el-form-button">
                    <el-button @click="save()" :loading="saveLoading">保存</el-button>
                    <el-button type="primary" @click="submit()" :loading="submitLoading">提交</el-button>
                  </div>
                </el-form-item>
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
  import { getDetail, projectEdit, projectSubmit, getProcess, buylist, editBuy, buySubmit } from '@/api/project'
  import { toChinesNum, formatMoney, formatTime, stringToArray, filesToArray, getTimeArray } from '@/utils/validate'
  import uploadFile from '@/components/uploadFile'
  export default {
    name: 'addbuy',
    data() {
      return {
        tableData: {
          list: [],
          type: 1,
          files: [],
          steps: [],
        },
        statusTable: ['', '待填写', '审批中', '拒绝', '进行中'],
        tableLoading: false,
        select: ['劳务', '采购'],
        saveLoading: false,
        submitLoading: false,
        id: 0,
        contract: {
          num: 0,
          result: []
        }
      }
    },
    mounted() {
      this.getDetail()
      NProgress.done()
    },
    components: {
      backLink,
      uploadFile
    },
    methods: {
      submit() {
        this.submitLoading = true
        editBuy(this.$route.params.buyid, this.$route.params.id, this.$store.getters.userid, this.tableData).then(res => {
          if(res.result === 'success') {
            // console.log(res)
            buySubmit(res.data.buy_id).then(res => {
              this.submitLoading = false
              if(res.result === 'success') {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$router.replace('/preview/'+this.$route.params.id+'/buy')
              }else {
                this.$message({
                  message: res.data.errmsg,
                  type: 'info'
                })
              }
            })
          }else {
            this.$message({
              message: res.data.errmsg,
              type: 'info'
            })
            this.submitLoading = false
          }
        })
      },
      tableRow(row) {
        // console.log(row)
        if(row.row.id == this.$route.params.buyid) {
          return 'hover-row-style'
        }
      },
      save() {
        this.saveLoading = true
        editBuy(this.$route.params.buyid, this.$route.params.id, this.$store.getters.userid, this.tableData).then(res => {
          this.saveLoading = false
          if(res.result === 'success') {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.$router.replace('/preview/'+this.$route.params.id+'/buy')
          }else {
            this.$message({
              message: res.data.errmsg,
              type: 'info'
            })
          }
        })
      },
      getBuylist() {
        buylist(this.$route.params.id).then(res => {
          if(res.result === 'success') {
            if(res.data) {
              const list = res.data.list
              let arr = []
              arr.push({
                name: '合同额',
                money: this.contract.num,
                status: '',
                id: '',
                step: this.contract.result,
                files: [],
                read: true
              })
              for(let l in list) {
                let carr = [], cnum = 0
                for(let c in list[l].content) {
                  carr.push({
                    money: list[l].content[c],
                    id: this.tableData.steps[cnum].id
                  })
                  cnum += 1
                }
                arr.push({
                  name: list[l].name,
                  money: list[l].price,
                  status: this.statusTable[list[l].status],
                  step: carr,
                  read: list[l].id == this.$route.params.buyid ? false : true,
                  id: list[l].id,
                  files: list[l].files ? filesToArray(list[l].files) : []
                })
                if(list[l].id == this.$route.params.buyid) {
                  this.tableData.files = list[l].files ? filesToArray(list[l].files) : []
                }
              }
              this.tableData.list = arr
              let step = []
              for(let i = 0; i < this.tableData.steps.length; i ++) {
                step.push({
                  money: '',
                  id: this.tableData.steps[i].id
                })
              }
              if(this.$route.params.buyid == 0) {
                this.tableData.list.push({
                  name: '',
                  money: '',
                  step: step,
                  status: '',
                  read: false,
                  id: ''
                })
              }
            }else {
              let step = []
              for(let i = 0; i < this.tableData.steps.length; i ++) {
                step.push({
                  money: '',
                  id: this.tableData.steps[i].id
                })
              }
              this.tableData.list.push({
                name: '',
                money: '',
                step: step,
                status: '',
                read: false,
                id: ''
              })
            }
          }
        })
      },
      addFiles(files) {
        this.tableData.files = files
      },
      getDetail() {
        this.tableLoading = true
        getDetail(this.$route.params.id).then(res => {
          // console.log(res)
          let step = []
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
            this.contract.result.push({
              label: '第'+toChinesNum(i+1)+'阶段'+'('+res.data.step[i].starttime+' ~ '+res.data.step[i].endtime+')金额明细(元)',
              money: res.data.step[i].step_price
            })
          }
          // console.log(step)
          this.tableData.steps = step
          this.contract.num = res.data.contract.price
          this.getBuylist()
          this.tableLoading = false
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>

<style lang="less">
.addbuy {
  position: relative;
  width: 100%;
  .content {
    width: 100%;
    position: relative;
    .tabs-handle {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10!important;
      background: #fff;
    }
    .body {
      padding: 44px 20px 0 20px;
      width: 100%;
      .el-form-button {
        margin-top: 20px;
        button {
          width: 154px;
          height: 40px;
        }
      }
      .search-handle {
        padding: 20px 0;
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
        input {
          border: none;
        }
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
        .hover-row-style {
          background-color: #ecf5ff;
        }
      }
      .list-page {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
