<template>
  <div class="wexamine">
		<back-link />
    <div class="content">
      <div class="tabs-handle">
        <el-tabs v-model="activeName" @tab-click="changeType" :stretch="stretch">
          <el-tab-pane label="未审批" name="first"></el-tab-pane>
          <el-tab-pane label="我负责的项目" name="second"></el-tab-pane>
          <el-tab-pane label="我监督的项目" name="third"></el-tab-pane>  
        </el-tabs>
      </div>
      <div class="body">
        <div class="search-handle">
        	<div class="content">
	        	<div class="content_main"> 
	        			<div style="margin:7px 10px 0 0 ;">时间</div> 
	        		  <div>
	        		  	<el-date-picker 
	        		  		class="date"
							      v-model="listData.startdate"
							      type="date"
							      format="yyyy-MM-dd"
      							value-format="yyyy-MM-dd"
      							@change = "selectDate"
							      placeholder="选择日期">
							    </el-date-picker>
	        		  </div>
	        		  <div class="border">~</div>
	        		  <div style="padding-left: 25px;">
	        		  	<el-date-picker
	        		  		class="date"
							      v-model="listData.enddate"
							      type="date"
							      format="yyyy-MM-dd"
      							value-format="yyyy-MM-dd"
      							@change = "selectDate"
							      placeholder="选择日期">
							    </el-date-picker>
	        		  </div>
	        		  <div style="margin-left: 150px;">
	        		  	<el-input
			              size="small"
			              placeholder="请输入关键字搜索"
			              v-model="listData.keyword"
			              @blur="Bulr"
                    @keyup.enter.native="enterKey"
			              class="search-box">
			              <i slot="suffix" class="el-input__icon el-icon-search"></i>
			            </el-input>
	        		  </div> 
	        	</div>             
          </div>
        </div>
        <div class="table-handle">
          <transition name="fade-transform" mode="out-in">
            <el-table
              :data="tableData"
              ref="table"
              highlight-current-row
              border
              style="width: 100%"
              v-show="activeTable" 
              @current-change="handleCurrentChange"
              @selection-change="handleSelectionChange">
              <el-table-column
					      type="selection"
					      width="55">
					    </el-table-column>
              <el-table-column
                fixed
                prop="date"
                label="日期" >
              </el-table-column>
              <el-table-column
                prop="name"
                label="项目名称" >
              </el-table-column> 
              <el-table-column
                prop="username"
                label="员工" 
                width="100">
              </el-table-column>
              <el-table-column
                prop="fact_worktime"
                label="已填工时" >
              </el-table-column>
              <el-table-column 
                label="审核工时" >
                <template slot-scope="scope" >    
                  <span v-if="scope.row.status == '2'" style="margin-left: 0.28rem;">{{scope.row.verify_worktime}}</span>
                  <el-input v-else class="elinput" v-model="scope.row.verify_worktime" placeholder=""></el-input>
                </template>                
              </el-table-column> 
              <el-table-column
                prop="content"
                label="工作内容" >
              </el-table-column>
              <el-table-column 
                label="操作" >
                <template slot-scope="scope"> 
                  <el-button @click="handleClick(scope.row.pro_id,scope.row.pro_status,scope.row.pro_type)" type="text" size="small" >查看项目</el-button>                   
                </template>
              </el-table-column>
            </el-table>
          </transition>
        </div>
      </div>
      <div class="examine_sumbit">
          <el-button @click="sumbit" type="primary" size="small" >审批提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import NProgress from 'nprogress'
  import {list,approve} from '@/api/work'
  import {flex} from '../flexible.js'
  import timechange from "../../utils/time";
import {getUserId} from '@/utils/auth'
import backLink from '@/components/backLink'

//import { config, dingAuth } from '@/utils/mobileconfig'
  export default {
    name: 'wexamine',
    data() {
      return {
      	listData:{
      		approveid:getUserId(),
   		// approveid:'122604106026256385',
	        type:'1',
	        startdate: timechange(new Date(new Date().getFullYear(), new Date().getMonth()-1, 1)),//上个月第一天
	        enddate: timechange(new Date()), //当天
	        keyword:'', 
      	},
      	approveData:{
      		approveid:getUserId(),
   		// approveid:'122604106026256385',
      		data:[{
            worktime_id:'',
            verify_worktime:'', 
          }],
      	},
      	startdate:'',
	    	enddate:'',
        activeName: 'first',
        activeTable: true,
        stretch: true,
        search: '',
        tableData: [],
        selectData:[],
      }
    },
    created() {
//  	config();
//    dingAuth();
    	this.fit();
			this.getList();   
//			console.log(this.listData.startdate)
    },
    components: {
      backLink, 
	},
    methods: {
    	selectDate(){
    		this.getList();
    	},
    	//适配
	    fit(){
	        flex();
	    },
	    //查询
	    Bulr(){ 
	    	this.getList();
      },
      enterKey(){
	    	this.getList();
      },
	    //审批列表
    	getList() { 
	        list(this.listData).then(res => {
	            // console.log(res)
	            const data = res.data; 
	            this.tableData = data;
	            this.tableData.map((item, index) => {
		             if (Number(item.verify_worktime) > 0) {
		             		this.tableData[index].verify_worktime = item.verify_worktime; 
		             } else{
		             		this.tableData[index].verify_worktime = item.fact_worktime;
		             }
					    }); 
//	            console.log(data)
	        })	         
	     },
	     handleCurrentChange(val) {
        console.log(val)
      },
      //多选
	    handleSelectionChange(val) {
	    	this.selectData = val;
        console.log(this.selectData)
     }, 
      changeType(tab, event){
      	if (tab.index == 0) {
      		this.listData.type = '1';
      		this.getList(); 
      	}else if (tab.index == 1) {
      		this.listData.type = '2';
      		this.getList();
      	}else{
      		this.listData.type = '3';
      		this.getList();
      	}
        console.log(tab.index, event);
      },
      // handleClick(id) { 
      //   this.$router.push('/handing/'+id) 
      //   // console.log(row);
      // },
      handleClick(id, status, type) {
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

      //审批提交操作
      sumbit() {
      	if (this.selectData.length > 0) {
      		this.selectData.map((item, index) => {
            this.approveData.data[index] = {} 
		        this.approveData.data[index].worktime_id = item.id;
		        this.approveData.data[index].verify_worktime = item.verify_worktime;
			    }); 
			    this.approveData.data = JSON.stringify(this.approveData.data);  
					approve(this.approveData).then(res => {
						if(res.code === 1){		 
		            const data = res.data; 
		            this.approveData.data = JSON.parse(this.approveData.data); 
		            this.$message({
				          showClose: true,
				          message: '提交成功',
				          type: 'success', 
				        });
		            this.getList();
						}
			    })
      	} else{
      		this.$message.error('请选择审批提交项');
      	}
      	
		     
      },
      go(url) {
        this.$router.push(url)
      }
    },
    watch: {
      "activeName"() {
        this.activeTable = false
        setTimeout(() => {
          this.activeTable = true
        }, 300)
      }
    },
    mounted() { 
      NProgress.done()
    }
  }
</script>

<style lang='less'> 
.wexamine {
  position: relative;
  width: 100%;
  font-size: 12px;
  color: #222222;
  .back-link{
      position: fixed;
      top: 0rem;
      left: 0;
      right: 0;
      z-index: 10!important; 
      background: #fff;
  }
  .content {
    width: 100%;
    position: relative;
    .tabs-handle {
      position: fixed;
      top: 0.9rem;
      left: 0;
      right: 0;
      z-index: 10!important;
      background: #fff;
      .el-tabs__nav-scroll .el-tabs__item{
      		font-size: 12px;
      	}
    }
    .content_main{
    	div{
    		float: left;
    	}
    	.date{
    		width: 160px;
    		height: 32px;
    		.el-input__inner{
    			height: 32px;
    			line-height: 32px;
    			font-size: 12px;
    			
    		}
    		.el-input__icon{
    				line-height: 32px;
    		}
    	}
    	.border{
    		margin-left: 25px;
				margin-top: 7px;
    	}
    }
    .examine_sumbit{
      padding-left: 20px;
      margin-bottom: 20px;
    }
    .body {
      padding: 100px 20px 0 20px; 
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
      	
      	.el-table tr td{
      		font-size: 12px;
      	}
        padding: 20px 0; 
        position: relative;
        .el-table--border th {
          background-color: #e6e5e6;
          font-size: 12px;
        }
       .el-table--border .el-table-column--selection{
        	background-color: #FFFFFF;
        }
        .el-table thead {
          color: #222;
        }
        .useless {
          &.el-button--text {
            color: #838383;
          }
        }
        .el-table__body{
        	color: #222222; 
        }
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

