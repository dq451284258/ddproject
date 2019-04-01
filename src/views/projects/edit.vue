<template>
  <div class="edit">
    <div class="content">
      <back-link />
      <div class="body">
        <el-form ref="form" :label-position="labelPosition" :model="projectForm" label-width="122px" size="small">
          <div class="raw" v-show="projectForm.contract.result.length">
            <div class="raw-head">
              <h5><strong>合同详情</strong></h5>
            </div>
            <div class="raw-content">
              <el-form-item label="">
                <div class="contract-file">
                  <label for="合同草稿">合同草稿和律师意见</label>
                  <div class="file-list">
                    <a :href="p.url" v-for="(p, index) in projectForm.interestfiles" :key="index" :download="p.name"><span>{{ p.name }}</span></a>
                  </div>
                </div>
                <p v-for="(p, index) in projectForm.contract.result" :key="index"><span>{{ p }}</span></p>
                <p class="aproval"><span>合同审批：</span><span style="color: #3296fa">同意</span><img class="access" src="../../assets/yinzhang@2x.png" alt=""></p>
              </el-form-item>
            </div>
          </div>
          <div class="raw">
            <div class="raw-head">
              <h5><strong>项目信息</strong></h5>
            </div>
            <div class="raw-content">
              <el-form-item label="系统编号" class="is-required">
                <el-input v-model="projectForm.number" :disabled="true" ></el-input>
              </el-form-item>
              <el-form-item label="项目类型" class="flex-style is-required">
                <el-select v-model="projectForm.projType" placeholder="预立项生产性项目" disabled @change="changeProjType">
                  <el-option :label="p" :value="index+1" v-for="(p, index) in projectForm.projTypeList" :key="index"></el-option>
                </el-select>
                <!-- <el-button type="text" size="small">清除</el-button> -->
              </el-form-item>
              <el-form-item label="项目名称" class="is-required">
                <el-input v-model="projectForm.name" placeholder="请输入..." maxlength="25" :disabled="projectForm.canEdit" ></el-input>
              </el-form-item>
              <el-form-item label="业主名称" class="">
                <el-input v-model="projectForm.ownerName" placeholder="请输入..." maxlength="25" :disabled="projectForm.canEdit" ></el-input>
              </el-form-item>
              <el-form-item label="预立项项目编号">
                <el-input v-model="projectForm.beforeNum" placeholder="请输入..." ></el-input>
              </el-form-item>
              <el-form-item label="项目编号">
                <el-input v-model="projectForm.projNum" placeholder="请输入..." :disabled="projectForm.canEdit" ></el-input>
              </el-form-item>
              <el-form-item label="项目成员" class="is-required">
                <div class="member-list">
                  <div class="member-list-handle">
                    <div class="title"><span>操作人</span></div>
                    <div class="members">
                      <member-list-view
                      :doneUserList="projectForm.doneUserList"
                      @getList="getDoneUserList"
                      @getAllMembers="getAllMembers"
                      :needClear="false"
                      :needAdd="-1"
                      v-if="projectForm.loading" />
                    </div>
                  </div>
                  <div class="member-list-handle">
                    <div class="title"><span>项目经理</span></div>
                    <div class="members">
                      <member-list-view
                      :doneUserList="projectForm.projManager"
                      @getList="getProjManager"
                      @getAllMembers="getAllMembers"
                      :needClear="true"
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
                      :needClear="true"
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
                      :needClear="true"
                      :needAdd="1500"
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
                      :needClear="true"
                      :needAdd="1500"
                      v-if="projectForm.loading" />
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="项目概述">
                <el-input v-model="projectForm.desc" type="textarea" placeholder="包括立项目的、成果价值、工期情况能否满意、与协同部门分工情况等" maxlength="8000" :disabled="projectForm.canEdit" ></el-input>
              </el-form-item>
              <el-form-item label="预计项目时间" class="is-required">
                <el-date-picker
                  v-model="projectForm.projTime"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="getTimeAuto()"
                  :disabled="projectForm.canEdit">
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
          <div class="raw" v-show="!projectForm.contract.result.length">
            <div class="raw-head">
              <h5><strong>合同详情</strong></h5>
            </div>
            <div class="raw-content">
              <el-form-item label="合同额" class="flex-style left is-required">
                <div style="display: flex">
                  <el-input v-model="projectForm.contract.num" @change="getContract" placeholder="请输入..." ></el-input><span class="input-after">元</span>
                </div>
                <el-form-item label="税率">
                  <el-input v-model="projectForm.contract.scale" @change="getContract" placeholder="请输入..." ></el-input><span class="input-after">%</span>
                </el-form-item>
              </el-form-item>
              <el-form-item label="合同价" class="flex-style left is-required">
                <span>{{ projectForm.contract.money | formatNum }}元</span>
              </el-form-item>
            </div>
          </div>
          <div class="raw">
            <div class="raw-head">
              <h5><strong>工时</strong></h5>
            </div>
            <div class="raw-content" v-if="projectForm.projType === 1">
              <transition-group name="fade-transform" mode="out-in">
                <div class="proj-stage" v-for="(ps, index) in projectForm.stage" :key="index">
                  <el-form-item label="项目阶段" class="flex-style left is-required">
                    <el-form-item :label="'第'+ toZh(index+1) +'阶段'">
                      <el-date-picker
                        v-model="ps.time"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="getStageTime(index)">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="合计" class="is-required">
                      <el-input class="small-input-day" type="number" :disabled="true" v-model="ps.days" placeholder="请输入..." ></el-input><span class="input-after">人天( {{ ps.days*8 }}小时 )</span>
                    </el-form-item>
                    <div class="clear-stage" v-show="index > 0" @click="clearStage(index)"><i class="el-icon-circle-close"></i></div>
                  </el-form-item>
                  <div class="" v-for="(pm, pindex) in ps.month" :key="pindex">
                    <el-form-item label="">
                      <el-input v-model="pm.desc" type="textarea" placeholder="请输入预期成果... " maxlength="8000" ></el-input>
                    </el-form-item>
                    <el-form-item label="">
                      <member-work-list-view
                      :doneUserList="pm.members"
                      @getList="getWorkList"
                      :needClear="false"
                      :needAdd="0"
                      :index="index"
                      :pindex="pindex"
                      v-if="projectForm.loading" />
                    </el-form-item>
                  </div>
                </div>
              </transition-group>
              <div class="proj-stage-add">
                <el-form-item label="">
                  <el-button type="primary" icon="el-icon-plus" plain class="stage-add-btn" @click="addStage()">添加</el-button>
                </el-form-item>
                <el-form-item label="">
                  <div class="stage-days-all"><span>预算工时合计 {{ projectForm.stageNum }}人天( {{ projectForm.stageNum*8 }}小时 )</span></div>
                </el-form-item>
              </div>
            </div>

            <div class="raw-content" v-else>
              <el-form-item label="人工成本总额" class="flex-style start">
                <el-input v-model="projectForm.memberCost" placeholder="请输入..." @change="getTotalBudget" :disabled="projectForm.canEdit" ></el-input><span class="input-after">元</span>
              </el-form-item>
              <transition-group name="fade-transform" mode="out-in">
                <div class="proj-stage" v-for="(ps, index) in projectForm.stage" :key="index">
                  <el-form-item label="项目阶段" class="flex-style left is-required">
                    <el-form-item :label="'第'+ toZh(index+1) +'阶段'">
                      <el-date-picker
                        v-model="ps.time"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="getStageTime(index)"
                        :disabled="projectForm.canEdit">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="合计" class="small-input is-required">
                      <el-input class="small-input-day" type="number" v-model="ps.days" placeholder="请输入..." :disabled="true" ></el-input><span class="input-after">人天( {{ ps.days*8 }}小时 )</span>
                    </el-form-item>
                    <el-form-item label="阶段结算金额" class="small-input large-lable">
                      <el-input v-model="ps.price" placeholder="请输入..." :disabled="projectForm.canEdit" ></el-input><span class="input-after">元</span>
                    </el-form-item>
                    <div class="clear-stage" v-if="!projectForm.canEdit" v-show="index > 0" @click="clearStage(index)"><i class="el-icon-circle-close"></i></div>
                  </el-form-item>
                  <div class="" v-for="(pm, pindex) in ps.month" :key="pindex">
                    <el-form-item label="" class="small-input">
                      <span class="input-before">{{ pm.m | subYM }}月</span><el-input class="small-input-day" v-model="pm.days" placeholder="请输入..." :disabled="true" ></el-input><span class="input-after">人天( {{ pm.days*8 }}小时 )</span>
                    </el-form-item>
                    <el-form-item label="">
                      <el-input v-model="pm.desc" type="textarea" placeholder="请输入预期成果... " maxlength="8000" :disabled="projectForm.canEdit" ></el-input>
                    </el-form-item>
                    <el-form-item label="">
                      <member-work-list-view
                      :doneUserList="pm.members"
                      @getList="getWorkList"
                      :needClear="false"
                      :needAdd="0"
                      :index="index"
                      :pindex="pindex"
                      v-if="projectForm.loading" />
                    </el-form-item>
                  </div>
                </div>
              </transition-group>
              <div class="proj-stage-add">
                <el-form-item label="">
                  <el-button type="primary" icon="el-icon-plus" plain class="stage-add-btn" @click="addStage()" :disabled="projectForm.canEdit">添加</el-button>
                </el-form-item>
                <el-form-item label="">
                  <div class="stage-days-all"><span>预算工时合计 {{ projectForm.stageNum }}人天( {{ projectForm.stageNum*8 }}小时 )</span></div>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="raw">
            <div class="raw-head">
              <h5><strong>预算</strong></h5>
            </div>
            <div class="raw-content">
              <el-form-item label="总预算" class="flex-style left is-required">
                <span style="margin-right: 100px">{{ projectForm.budget | formatNum }}元</span>
                <!-- <el-form-item label="分包采购">
                  <el-input v-model="projectForm.purchase" placeholder="请输入..." class="width-small money" :disabled="projectForm.canEdit"></el-input>
                </el-form-item> -->
              </el-form-item>
              <!-- <el-form-item label="采购比例">
                <el-input v-model="projectForm.purchaseScale" placeholder="请输入..." class="width-small scale" :disabled="projectForm.canEdit"></el-input>
              </el-form-item> -->
              <el-form-item label="成本类别(商务)">
                <el-table style="width: 100%" :span-method="arraySpanMethod" :data="projectForm.costTable" class="cost-table" >
                  <el-table-column label="工作项目" prop="title"></el-table-column>
                  <el-table-column label="EBM" prop="emb"></el-table-column>
                  <el-table-column label="具体内容">
                    <template slot-scope="scope">
                      <el-input type="text" v-model="scope.row.desc" :disabled="projectForm.canEdit"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="项目预算">
                    <el-table-column label="单价(元)">
                      <template slot-scope="scope">
                        <el-input type="text" v-model="scope.row.price" @change="getMoney(scope.$index, scope.row)" :disabled="projectForm.canEdit"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="数量">
                      <template slot-scope="scope">
                        <el-input type="text" v-model="scope.row.num" @change="getMoney(scope.$index, scope.row)" :disabled="projectForm.canEdit"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="金额(元)">
                      <template slot-scope="scope">
                        <span>{{ scope.row.money | formatNum }}</span>
                      </template>
                    </el-table-column>
                  </el-table-column>
                  <el-table-column label="所占合同价比例(%)" prop="scale"></el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="合计" class="is-required">
                <div><span>{{ projectForm.total | formatNum }}元</span></div>
              </el-form-item>
              <el-form-item label="包采购 （签订采购合同）">
                <el-table style="width: 100%" :data="projectForm.buyTable" class="cost-table buy-table" >
                  <el-table-column label="工作项目" prop="name"></el-table-column>
                  <el-table-column label="具体内容">
                    <template slot-scope="scope">
                      <el-input type="text" v-model="scope.row.desc" :disabled="projectForm.canEdit"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="金额(元)">
                    <template slot-scope="scope">
                      <el-input type="text" v-model="scope.row.price" @change="getBuyTotal(scope.$index, scope.row)" :disabled="projectForm.canEdit"></el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="合计" class="is-required">
                <div><span>{{ projectForm.buyTotal | formatNum }}元</span><span style="margin-left: 15px">采购比例：{{ projectForm.contract.money > 0 ? (projectForm.buyTotal*100/projectForm.contract.money).toFixed(2) : 0 }}%</span></div>
              </el-form-item>
            </div>
          </div>
          <div class="raw">
            <div class="raw-head" v-show="projectForm.status">
              <h5><strong>毛利率</strong></h5>
            </div>
            <div class="raw-content">
              <el-form-item label="毛利率" v-show="projectForm.status">
                <span>{{ projectForm.interest }}%</span>
              </el-form-item>
              <el-form-item label="合同描述" v-show="projectForm.status">
                <el-input v-model="projectForm.interestdesc" type="textarea" placeholder="请输入... " maxlength="8000" ></el-input>
              </el-form-item>
              <el-form-item label="附件">
                <uploadFile :files="projectForm.interestfiles" @addFiles='addInterestfiles' v-if="projectForm.loading" />
              </el-form-item>
              <el-form-item label="">
                <div class="el-form-button">
                  <el-button @click="save()" :loading="saveLoading">保存</el-button>
                  <el-button type="primary" @click="submit()" :loading="submitLoading">提交</el-button>
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
  import { toChinesNum, formatMoney, formatTime, stringToArray, filesToArray, getTimeArray, arrayFilterRe } from '@/utils/validate'
  import { getDetail, projectEdit, projectSubmit, projectEditFormal } from '@/api/project'
  import uploadFile from '@/components/uploadFile'
  import updownloadFile from '@/components/updownloadFile'
  import { dingAuth } from '@/utils/config'

  export default {
    name: 'edit',
    data() {
      return {
        projectForm: {
          id: this.$route.params.id,
          status: '',
          canEdit: false,
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
          projTime: [],
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
          budget: 0,
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
              scale: '',
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
              title: '专家咨询',
              emb: '劳务费',
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
          total: 0,
          files: [],
          loading: false,
          //合同
          contract: {
            num: 0,
            scale: 0,
            money: 0,
            result: []
          },
          //采购
          buyTotal: 0,
          buyTable: [{
            name: '对内合同',
            desc: '',
            price: ''
          }, {
            name: '对外合同',
            desc: '',
            price: ''
          }],
          //毛利率
          interest: 0,
          interestdesc: '',
          interestfiles: []
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
      updownloadFile
    },
    watch: {
      $route() {
        NProgress.done()
        Object.assign(this.$data, this.$options.data())
        this.getDetail()
      },
      "projectForm.allMembers"(val) {
        // console.log(val)
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
      },
      "projectForm.contract.money"(val) {
        this.changeInterest()
        this.getCostScale()
      },
      "projectForm.budget"(val) {
        this.changeInterest()
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
        // console.log(pindex)
        let num = 0
        for(let i = 0; i < array.length; i ++) {
          num += parseInt(array[i].days)
        }
        this.projectForm.stage[index].month[pindex].days = num
        let num_m = 0
        for(let i = 0; i < this.projectForm.stage[index].month.length; i ++) {
          num_m += parseInt(this.projectForm.stage[index].month[i].days)
        }
        this.projectForm.stage[index].days = num_m
        this.projectForm.stage[index].month[pindex].members = [...array]
        this.getSatgeDays()
      },
      getAllMembers() {
        let arr = this.projectForm.projManager.concat(this.projectForm.coordination).concat(this.projectForm.others)
        arr = arrayFilterRe(arr)
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
      getContract() {
        this.projectForm.contract.money = (this.projectForm.contract.num/(1+this.projectForm.contract.scale/100)).toFixed(2)
      },
      getTotalBudget() {
        this.projectForm.budget = parseFloat(this.projectForm.memberCost) + parseFloat(this.projectForm.total) + parseFloat(this.projectForm.buyTotal)
      },
      changeInterest() {
        if( parseFloat(this.projectForm.contract.money) > 0 ) {
          this.projectForm.interest = ( ( parseFloat(this.projectForm.contract.money) - parseFloat(this.projectForm.budget) ) * 100 / parseFloat(this.projectForm.contract.money) ).toFixed(2)
        }
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
          let num_m = 0
          for(let m = 0; m < list[i].month.length; m ++) {
            let num_mem = 0
            for(let o = 0; o < list[i].month[m].members.length; o ++) {
              Num += parseInt(list[i].month[m].members[o].days)
              num_mem += parseInt(list[i].month[m].members[o].days)
            }
            this.projectForm.stage[i].month[m].days = num_mem
            num_m += num_mem
          }
          this.projectForm.stage[i].days = num_m
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
        this.projectForm.stage[index].days = 0
        this.getSatgeDays()
        this.getAllMembers()
      },
      getDefaultStageTime(index) {
        const timeArr = this.projectForm.stage[index].time
        this.projectForm.stage[index].start = formatTime(timeArr[0], 'yyyy-MM-dd')
        this.projectForm.stage[index].end = formatTime(timeArr[1], 'yyyy-MM-dd')
        let time = []
        // console.log(this.projectForm.stage[index])
        if(this.projectForm.projType === 1) {
          time = ['-1']
        }else {
          time = getTimeArray(this.projectForm.stage[index].start, this.projectForm.stage[index].end)
        }
        let arr = []
        if(this.projectForm.stage[index].month[0].m == -1) {
          for(let i = 0; i < time.length; i ++) {
            arr.push({
              m: time[i],
              days: 0,
              desc: '',
              members: []
            })
          }
          this.projectForm.stage[index].month = arr
        }else {
          for(let i = 0; i < time.length; i ++) {
            arr.push({
              m: time[i],
              days: 0,
              desc: '',
              members: []
            })
            this.projectForm.stage[index].month[i].m = time[i]
          }
        }

        this.getSatgeDays()
        this.getAllMembers()
      },
      getTimeAuto() {
        const timeArr = this.projectForm.projTime
        if(timeArr) {
          this.projectForm.projStart = formatTime(timeArr[0], 'yyyy-MM-dd')
          this.projectForm.projEnd = formatTime(timeArr[1], 'yyyy-MM-dd')
        }else {
          this.projectForm.projStart = ''
          this.projectForm.projEnd = ''
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
        }else {
          this.projectForm.costTable[index].money = 0
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
        this.getTotalBudget()
        this.getCostScale()
      },
      getCostScale() {
        const list = this.projectForm.costTable
        for(let i = 0; i < list.length; i ++) {
          let m = list[i].money
          if(!m) {
            m = 0
            this.projectForm.costTable[i].scale = ''
          }else if(this.projectForm.contract.money == 0) {
            this.projectForm.costTable[i].scale = ''
          }else {
            this.projectForm.costTable[i].scale = ( ( m / this.projectForm.contract.money ) * 100 ).toFixed(2)
          }
        }
      },
      getBuyTotal(index, row) {
        const list = this.projectForm.buyTable
        this.projectForm.buyTotal = 0
        for(let i = 0; i < list.length; i ++) {
          let m = list[i].price
          if(!m) {
            m = 0
          }
          this.projectForm.buyTotal += parseFloat(m)
        }
        this.getTotalBudget()
      },
      getDetail() {
        getDetail(this.$route.params.id).then(res => {
          // console.log(res)
          if(this.$route.params.id == 0) {
            this.projectForm.number = res.data.base.sys_num
          }else {
            this.projectForm.id = res.data.base.id
            this.projectForm.status = res.data.base.status == 201 ? true : ( res.data.base.status == 203 ? true : false )
            this.projectForm.canEdit = res.data.base.status == 204 ? true : ( res.data.base.status == 206 ? true : false )
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
            this.projectForm.projTime = [res.data.base.starttime, res.data.base.endtime]
            let step = []
            // console.log(res.data.step)
            for(let i = 0; i < res.data.step.length; i ++) {
              let mon = [], num = 0
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
                num += parseInt(mem.days)
              }
              step.push({
                start: res.data.step[i].starttime,
                end: res.data.step[i].endtime,
                time: [res.data.step[i].starttime, res.data.step[i].endtime],
                days: num,
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
            this.projectForm.total = cost.business.total ? parseFloat(cost.business.total) : 0
            this.projectForm.files = res.data.base.files ? filesToArray(res.data.base.files) : []
            this.projectForm.contract.money = parseFloat(parseFloat(res.data.contract.price)/(1+ parseFloat(res.data.contract.rate)/100)).toFixed(2)
            this.projectForm.contract.scale = res.data.contract.rate
            this.projectForm.contract.num = res.data.contract.price
            this.projectForm.memberCost = res.data.base.member_cost
            this.projectForm.buyTable = cost.buy.table.length ? cost.buy.table : [{
              name: '对内合同',
              desc: '',
              price: ''
            }, {
              name: '对外合同',
              desc: '',
              price: ''
            }]
            this.projectForm.buyTotal = cost.buy.total ? parseFloat(cost.buy.total) : 0
            this.projectForm.interestdesc = res.data.contract.comment
            this.projectForm.interestfiles = res.data.contract.files ? filesToArray(res.data.contract.files) : []
            this.projectForm.contract.result = res.data.contract.contract_approval_result
          }
          this.projectForm.loading = true
          // console.log(this.projectForm.stage)
          for(let i = 0; i < this.projectForm.stage.length; i ++) {
            this.getDefaultStageTime(i)
          }
          this.getSatgeDays()
          this.getBuyTotal()
          // console.log(this.projectForm.stage)
        }).catch(error => {
          console.log(error)
        })
      },
      save() {
        this.beforeSave().then(res => {
          this.saveLoading = true
          projectEditFormal(this.projectForm).then(res => {
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
            reject(false)
            return false
          }
          if(!form.doneUserList.length || !form.projManager.length || !form.supervisor.length || !form.others.length) {
            this.$message({
              message: '请补全项目成员信息',
              type: 'info'
            })
            reject(false)
            return false
          }
          for(let i = 0; i < form.stage.length; i ++) {
            if(!form.stage[i].start || !form.stage[i].end || !form.stage[i].days) {
              this.$message({
                message: '请补工时信息',
                type: 'info'
              })
              reject(false)
              return false
            }
          }
          if(!form.budget) {
            this.$message({
              message: '请补全预算信息',
              type: 'info'
            })
            reject(false)
            return false
          }
          resolve(true)
        })
      },
      submit() {
        this.submitLoading = true
        this.beforeSave().then(res => {
          projectEditFormal(this.projectForm).then(res => {
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
              this.submitLoading = false
              this.$message({
                message: res.data.errmsg,
                type: 'info'
              })
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
      },
      addInterestfiles(files) {
        this.projectForm.interestfiles = files
      }
    },
    filters: {
      formatNum(str) {
        return formatMoney(str.toString())
      },
      subYM(str) {
        return str.substring(0, 4) + '年' + str.substring(4, 6)
      }
    }
  }
</script>

<style lang='less'>
  .edit {
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
            .contract-file {
              display: flex;
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
            }
            .aproval {
              position: relative;
              .access {
                position: absolute;
                left: 30%;
                bottom: -20px;
              }
            }
            .small-input {
              .el-input__inner {
                width: 100px;
              }
            }
            .small-input-day {
              width: 100px;
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
              &.money::after {
                content: '元';
                position: absolute;
                right: -20px;
              }
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
            .buy-table {
              border-left: 1px solid #ebeef5;
              border-top: 1px solid #ebeef5;
              border-right: 1px solid #ebeef5;
              thead th {
                background: #f5f7fa;
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
              &.start {
                .el-form-item__content {
                  width: 170px;
                  .input-before {
                    width: 50px;
                  }
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
                .large-lable {
                  .el-form-item__label {
                    width: 110px!important;
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

