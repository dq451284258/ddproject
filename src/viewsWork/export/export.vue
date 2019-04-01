<template>
  <div class="examine" >
		<back-link />

  	<div class="export_search"> 
  		<div class="search">
	  		<el-input
	  			class="date"
			    placeholder="请输入内容"
			    prefix-icon="el-icon-search" 
          @keyup.enter.native="enterKey"
			    v-model="selectData.keywords">
				</el-input>
	  	</div> 
  		<div @click="Bulr" class="search_btn"> 	
	  			搜索	
  		</div>
  	</div>
  	<div class="examine_box">  
	      <div class="div export_title" style="margin:7px 10px 0 0 ;">项目类型</div>
		  	<div class="div examine_btn"> 
			  	<el-select class="select" @change = "selectDate" v-model="selectData.type" placeholder="请选择">
				    <el-option
				      v-for="item in options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				  </el-select>
		    </div> 
		  <div class="div export_time" style="margin:7px 10px 0 50px ;">时间</div>
		  <div class="div">
		  	<el-date-picker
		  		class="date"
					v-model="selectData.selected_time"
					type="month"
					 format="yyyy-MM"
      		value-format="yyyy-MM"
      		@change = "selectDate"
					placeholder="选择月">
				</el-date-picker>
		  </div>
			  
		<!-- <div class="div">
		  	<el-date-picker
		  		class="date"
		      v-model="selectData.start_time"
		      type="date"
		      format="yyyy-MM-dd"
      		value-format="yyyy-MM-dd"
      		@change = "selectStart"
		      placeholder="选择日期">
		    </el-date-picker>
		  </div> -->
		   <!-- <div class="div border">~</div> -->
		  <!-- <div class="div"> 
		  	<el-date-picker
		  		class="date"
		      v-model="selectData.end_time"
		      type="date"
		      format="yyyy-MM-dd"
					value-format="yyyy-MM-dd"
					@change = "selectEnd"
		      placeholder="选择日期">
		    </el-date-picker>
		  </div> -->
		   
	</div>
	
	<div class="examine_table">
		<div class="examine_btn" >
			<span @click="exList"><i class="el-icon-edit-outline"></i>导出</span>			
    </div> 
		<el-table
				v-loading="loading"
		    ref="multipleTable"
		    :data="listData"
		    tooltip-effect="dark"
		    height="800"
		    border
		    style="width: 100%"
		    @selection-change="handleSelectionChange"> 
				<el-table-column
		      prop="advance_pro_num"
					width="110"
		      label="预立项项目编号"
		    >
		    </el-table-column>
		    <el-table-column
		      prop="pro_num"
		      label="项目编号"
		    >
		    </el-table-column>
		    <el-table-column
		      prop="type"
		      label="项目类型"
		    >
		    </el-table-column> 
		    <el-table-column
		      prop="name"
		      label="项目名称"
		    >
		    </el-table-column> 
		    <el-table-column
		      prop="manager_dep"
		      label="项目所属部门"
		    >
		    </el-table-column> 
		    <el-table-column
		      prop="member"
		      label="项目参与人"
		    >
		    </el-table-column> 
		    <el-table-column
		      prop="member_dep"
		      label="参与人所属部门"
		     >
		     
		    </el-table-column> 
		    <el-table-column
		      prop="starttime"
		      label="期间从"
		    >
		    </el-table-column> 
		    <el-table-column
		      prop="endtime"
		      label="期间至"
		    >
		    </el-table-column> 
		    <el-table-column
		      prop="estimated_time"
		      label="预算工时"
		     >
		     
		    </el-table-column> 
		    <el-table-column
		      prop="actual_time"
		      label="填报工时"
		    >
		    </el-table-column> 
		    <el-table-column
		      prop="verify_time"
		      label="审核后工时"
		    >
		    </el-table-column>   
		  </el-table>
		  <!-- <div class="list-page">
				<el-pagination background layout="prev, pager, next" :total="pageData.total" :page-size="1"
				:current-page="pageData.current" @current-change="changePage"></el-pagination>
			</div> -->
	</div> 
  </div>
</template>

<script>
// import { config, dingAuth } from '@/utils/mobileconfig'
import { getUserInfo } from '@/api/user' 
import NProgress from 'nprogress'
import {flex} from '../flexible.js'
import {exportList} from '@/api/work' 
import timechange from "../../utils/time";
import request from '@/utils/request'
import backLink from '@/components/backLink'
import {getUserId} from '@/utils/auth'
export default { 
	name: 'examine',
  data() {
    return {
				loading:false,
    	  pageData: {
          total: 1,
          p: 1,
          l: 20,
          current: 1
        },
    	  selectData:{
					//用户id
		      user_id: getUserId(),//用户id 		        
		      // user_id:'122604106026256385',
					type:'',
					selected_time:'',
	        // start_time: timechange(new Date(new Date().getTime()-31 * 24 * 3600 * 1000)), 
	        // end_time: timechange(new Date()),
	        keywords:'', 
	        // page:1,
	        // limit:20, 
	        is_export:'0', 
    	  },
        options: [{
          value: '',
          label: '全选'
        },{
          value: '1',
          label: '预立项生产性项目'
        }, {
          value: '2',
          label: '正式立项生产性项目'
        }, {
          value: '3',
          label: '募投项目'
        }, {
          value: '4',
          label: '内部管理'
        }, {
          value: '5',
          label: '研发项目'
        },{
          value: '6',
          label: '事务型项目'
        }],
        value: '1',
	    startdate:'',
	    enddate:'',
	    keyword:'',
	    tableData3: [{     	   
          date: '2016-05-03',
          name: '王小虎', 
        }, {
          date: '2016-05-02',
          name: '王小虎', 
        }, {
          date: '2016-05-04',
          name: '王小虎', 
        }, {
          date: '2016-05-01',
          name: '王小虎', 
        }, {
          date: '2016-05-08',
          name: '王小虎', 
        }, {
          date: '2016-05-06',
          name: '王小虎', 
        }, {
          date: '2016-05-07',
          name: '王小虎', 
				}],
				start:'',
        listData:[],
        multipleSelection: [],
        baseURL: process.env.NODE_ENV === 'development' ? '/api/api/v1' : 'https://testapi.arctron.cn/api/v1'
    }
  },
  created() {
  	// config();
    // dingAuth();
		this.fit();
		this.getList();  
  },
  mounted() { 
      NProgress.done()
	 },
	  components: {
      backLink, 
	},
  methods: {
  	selectDate(){
			this.selectData.page = 1;
    	this.getList();
		},
		 enterKey(){
	    	this.getList();
      },
		// 开始时间
		selectStart(){
			// console.log(this.selectData.start_time)
			if (this.selectData.start_time && this.selectData.end_time && this.selectData.end_time > this.selectData.start_time) {
				if (this.compareDate(this.selectData.start_time,this.selectData.end_time)) {
					this.selectData.start_time = this.selectData.start_time;
						 this.getList();
				} else { 
						this.$message.error('选择的时间不能超过一个月');
						 
				}
			} else {
				this.$message.error('请重新选择时间');
			}
		
		},
		// 结束时间
		selectEnd(){
			if (this.selectData.start_time && this.selectData.end_time && this.selectData.end_time > this.selectData.start_time) {
				if (this.compareDate(this.selectData.start_time,this.selectData.end_time)) {
						this.selectData.end_time = this.selectData.end_time;
						this.getList();
				} else {
					 
						this.$message.error('选择的时间不能超过一个月');
						 
				}
			} else {
				this.$message.error('请重新选择时间');
			}
		},
		// 判断时间是否超过一个月
		compareDate(sDate, endDate){  
			var	s1 = new Date(sDate.replace(/-/g, "/"));
			var	s2 = new Date(endDate.replace(/-/g, "/"));
			var days = s2.getTime() - s1.getTime();
			var time = parseInt(days / (1000 * 60 * 60 * 24));
			if (time <=31 ) {
				 return true;
			} else {
				 return false;
			}
		},
		// compareDate(sDate, endDate){
		//     var sDate = new Date(sDate);
		//     var eDate = new Date(endDate); 
		//     if (eDate.getFullYear() - sDate.getFullYear() > 1) {//先比较年
		//         return true;
		//     } else if (eDate.getMonth() - sDate.getMonth() > 1) {//再比较月
		//         return true;
		//     } else if (eDate.getMonth() - sDate.getMonth() == 1) {
		//         if (eDate.getDate() - sDate.getDate() >= 1) {
		//             return true;
		//         }
		//     }
		//      else if (eDate.getFullYear() - sDate.getFullYear() == 1) {
		//         if (eDate.getMonth() + 12 - sDate.getMonth() > 1) {
		//             return true;
		//         }
		//          else if (eDate.getDate() - sDate.getDate() >= 1) {
		//             return true;
		//         }
		//     }
		//     return false;
		// },
  	//适配
    fit(){
        flex();
    },
    getList(){
			this.loading = true;			
    	exportList(this.selectData).then(res => { 
				 if (res.result === "success") {
						this.loading = false;
					 	const data = res.data.items; 
						this.listData = data; 
	//	        this.total = res.data.total_pages;
						this.selectData.page = res.data.current_page;  
						this.pageData.current = res.data.current_page
						// if (data.length > 0) { 
						//   this.pageData.total = res.data.total_pages
						// } else {
						//   this.pageData.total = 0; 	
						// } 
						// console.log(this.total)					 
				 } else {
						this.loading = true;					 
				 }
	        
	        
	    })	  
		},
		// changePage(val) {
		// 		this.pageData.p = val;
		// 		this.selectData.page =val;
    //     this.getList()
    // },
    exList(){    
    	let url = this.baseURL + "/worktime/export?is_export=1" +  "&user_id=" + 
    	getUserId() + "&start_time=" + 
    	this.selectData.start_time + "&end_time="+ this.selectData.end_time + 
    	"&type=" + this.selectData.type + "&keywords=" + this.selectData.keywords
    	window.location.href = url;
//    window.open(exportList(this.selectData).then(res => { 
//	         window.location.href
//	  	}))
    	
//  	exportList(this.selectData).then(res => { 
//	         window.location.href
//	  	})	 
    },
    //查询
    Bulr(){ 
    	this.getList();
    },
    handleSizeChange(val){
      this.selectData.limit = val; 
      this.getList();
    },
    handleCurrentChange(val){
      this.selectData.page = val; 
      this.getList();
		},
		
    toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
    },
   handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val)
   }, 
   
  }
}
</script> 
<style lang="less">
.examine{
	font-size: 12px;
	height: 100%;
	.export_search{
		 padding: 20px 0 20px 20px; 
		 float: left; 
     width: 100%;
		 div{
		 	float: left;
		 }
		.search{
		 	.date{
		 		width: 454px;
		 		height: 32px;
		 		line-height: 32px;
		 		.el-input__inner{
		 			height: 32px;
		 			line-height: 32px;
		 			font-size: 12px;
		 		}
		 		.el-input__icon{
    				line-height: 32px;
    		}
		 	}
		}
		.search_btn{
			width: 75px;
			height: 32px;
			text-align: center;
			line-height: 32px;
			background: #008CEE;
			color: #FFFFFF;
			border-radius: 5px;
			margin-left: 10px;
			cursor: pointer;
		}
	}
	.examine_box{
		float: left;
		margin: 0 0 20px 20px;
		.div{
			float: left;
		}
		.border{
			margin:7px 25px; 
    }
    .date,.select{
    	width: 160px;
	 		height: 32px;
	 		line-height: 32px;
	 		.el-input__inner{
	 			height: 32px;
	 			line-height: 32px;
	 		}
	 		.el-input__icon{
				line-height: 32px;
			}
	  }
	  .select{
	  	width: 190px; 
	  }
	}
	 
	.examine_table{   
		float: left;
		margin-left: 20px;
		width: 95%;
		border-top: #CCCCCC 1px solid;
		.examine_btn{
			text-align: right; 
	    height: 50px;
	    line-height: 50px;
	    margin-right: 20px;
	    color: #008cee;		
			span{
				cursor: pointer;
			}
		}
		.has-gutter tr th{
			background: #e6e5e6;
			color: #222222;
			font-size: 12px;
		}
		.el-table tr td{
			font-size: 12px;
			color: #222222;
		}
	}
	/*.examine_btn{
		text-align: center;
	}
	
	 
	.export_title{
		font-size: 14px;
		margin-top: 0.7rem;
		text-align: right;
		margin-right: -0.5rem;
	}
	.export_time{
		font-size: 14px;
		margin-top: 0.7rem;
		text-align: right;
	}*/
}


</style>
<style lang="less">
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
	} 
  .div {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  /**/ 

 
</style>
