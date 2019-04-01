<template>
  <div class="projects">
    <div class="content">
      <div class="tabs-handle">
        <el-tabs v-model="activeName" @tab-click="changeType" :stretch="stretch">
          <el-tab-pane label="全部" name="0"></el-tab-pane>
          <el-tab-pane label="我监督的" name="1"></el-tab-pane>
          <el-tab-pane label="我创建的" name="5"></el-tab-pane>
          <el-tab-pane label="我负责的" name="2"></el-tab-pane>
          <el-tab-pane label="我参与的" name="3"></el-tab-pane>
          <el-tab-pane label="已结束" name="4"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="body">
        <div class="search-handle">
          <div class="content">
            <el-input
              size="small"
              placeholder="请输入关键字搜索"
              v-model="search"
              class="search-box"
              @keyup.enter.native='searchK()'
              >
              <i slot="suffix" class="el-input__icon el-icon-search" @click="searchK()"></i>
            </el-input>
            <el-button type="primary" class="search-btn" @click="go('/create/0')">申请立项</el-button>
          </div>
        </div>
        <div class="table-handle">
          <transition name="fade-transform" mode="out-in">
            <el-table
              :data="tableData"
              border
              style="width: 100%"
              v-show="activeTable"
              v-loading="tableLoading">
              <el-table-column
                fixed
                prop="name"
                label="项目名称"
                width="">
              </el-table-column>
              <el-table-column
                prop="type"
                label="项目类型"
                width="">
              </el-table-column>
              <el-table-column
                prop="projNum"
                label="项目编号"
                width="">
              </el-table-column>
              <el-table-column
                prop="beforeNum"
                label="预立项编号"
                width="">
              </el-table-column>
              <el-table-column
                prop="manager"
                label="负责人"
                width="">
              </el-table-column>
              <el-table-column
                prop="supervisor"
                label="监督人"
                width="">
              </el-table-column>
              <el-table-column
                prop="start"
                label="开始时间"
                width="">
              </el-table-column>
              <el-table-column
                prop="end"
                label="更新时间"
                width="">
              </el-table-column>
              <el-table-column
                prop="process"
                label="项目进度"
                width="">
              </el-table-column>
              <el-table-column
                prop="aeTime"
                label="实际/预计工时(%)"
                width="">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="130">
                <template slot-scope="scope">
                  <el-button @click="scope.row.look && look(scope.row.id, scope.row.process, scope.row.type)" type="text" size="small" :class="{'useless': !scope.row.look}">查看</el-button>
                  <el-button @click="scope.row.edit && edit(scope.row.id, scope.row.process, scope.row.type)" type="text" size="small" :class="{'useless': !scope.row.edit}">编辑</el-button>
                  <el-button @click="scope.row.buy && buy(scope.row.id, scope.row.process)" type="text" size="small" :class="{'useless': !scope.row.buy}" v-show="scope.row.type==='正式立项生产性项目' || '预立项生产性项目'">采购</el-button>
                </template>
              </el-table-column>
            </el-table>
          </transition>
        </div>
        <div class="list-page">
          <el-pagination background layout="prev, pager, next" :total="pageData.total" :page-size="1"
          :current-page="pageData.current" @current-change="changePage"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import NProgress from 'nprogress'
  import { getList } from '@/api/project'
  import { getUserInfo } from '@/api/user'

  export default {
    name: 'projects',
    data() {
      return {
        userid: this.$store.getters.userid,
        activeName: '0',
        activeTable: true,
        stretch: true,
        search: '',
        tableData: [],
        tableLoading: false,
        pageData: {
          total: 1,
          p: 1,
          l: 10,
          current: 1
        }
      }
    },
    mounted() {
      NProgress.done()
      this.getMyList()
    },
    methods: {
      changeType(tab, event) {
        this.pageData.p = 1
        this.getMyList()
        this.activeTable = false
        setTimeout(() => {
          this.activeTable = true
        }, 300)
      },
      look(id, status, type) {
        if(status === '进行中') {
          if(type === '正式立项生产性项目') {
            this.$router.push('/aproval/'+id)
          }else {
            this.$router.push('/handing/'+id)
          }
        }else if(status === '立项进行中' || status === '暂停中' || status === '终止' || status === '完工' || status === '已结束'){
          this.$router.push('/aproval/'+id)
        }else {
          this.$router.push('/preview/'+id)
        }
      },
      edit(id, status, type) {
        if(status === '合同待填写') {
          this.$router.push('/edit/'+id)
        }else if(status === '立项待填写') {
          this.$router.push('/lastEdit/'+id)
        }else {
          if(type === '正式立项生产性项目') {
            if(status === '审批已拒绝') {
              this.$router.push('/lastEdit/'+id)
            }else if(status === '合同已拒绝') {
              this.$router.push('/edit/'+id)
            }else {
              this.$router.push('/formalEdit/'+id)
            }
          }else {
            this.$router.push('/create/'+id)
          }
        }
      },
      buy(id, status) {
        this.$router.push('/preview/'+id+'/buy')
      },
      go(url) {
        this.$router.push(url)
      },
      changePage(val) {
        this.pageData.p = val;
        this.getMyList()
      },
      searchK() {
        this.pageData.p = 1
        this.getMyList()
      },
      getMyList() {
        this.tableLoading = true
        getList(this.userid, this.activeName, this.search, this.pageData.p, this.pageData.l ).then(res => {
          // console.log(res)
          if(res.result === 'success') {
            this.tableLoading = false
            this.pageData.current = res.data.current_page
            this.pageData.total = res.data.total_pages
            const data = res.data.projects
            let arr = []
            for(let i = 0; i < data.length; i ++) {
              arr.push({
                id: data[i].id,
                type: data[i].type,
                projNum: data[i].pro_num,
                beforeNum: data[i].advance_pro_num,
                manager: data[i].manager,
                supervisor: data[i].supervisor,
                start: data[i].starttime,
                end: data[i].updated_at,
                process: data[i].status,
                actureTime: data[i].actual_time,
                estimate: data[i].estimated_time,
                aeTime: parseInt(data[i].estimated_time) > 0 ? ( ( parseInt(data[i].actual_time)/parseInt(data[i].estimated_time) )*100 ).toFixed(2) : '--',
                name: data[i].name,
                look: data[i].actions.is_viewable,
                edit: data[i].actions.is_editable,
                buy: data[i].actions.is_purchased
              })
            }
            this.tableData = [...arr]
          }
        })
      }
    },
    watch: {
      // "activeName"() {
      //   this.pageData.p = 1
      //   this.getList()
      //   this.activeTable = false
      //   setTimeout(() => {
      //     this.activeTable = true
      //   }, 300)
      // }
    }
  }
</script>

<style lang='less'>
.projects {
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
      .search-handle {
        padding: 20px 0;
        position: relative;
        &::after {
          content: "";
          height: 1px;
          background: #e1e1e1;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
        }
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
      }
      .list-page {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>

<style lang='less'>
.el-tabs__item {
  color: #777;
  height: 44px;
  line-height: 44px;
}
.el-tabs__nav-wrap::after {
  height: 1px;
  background-color: #e1e1e1;
}
.el-tabs__header {
  margin: 0;
}
</style>

