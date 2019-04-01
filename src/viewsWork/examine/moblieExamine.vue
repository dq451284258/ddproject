<template>
  <div class="moblieEx">
    <div class="content">
      <div class="tabs-handle">
        <el-tabs class="tab" v-model="activeName" @tab-click="changeType" :stretch="stretch">
          <el-tab-pane label="未审批" name="first"></el-tab-pane>
          <el-tab-pane label="我负责的项目" name="second"></el-tab-pane>
          <el-tab-pane label="我监督的项目" name="third"></el-tab-pane>  
        </el-tabs>
      </div>
      <div v-if="show">
      
	      <div class="data_search">
	      	<div class="search"> 
	      		<i class="el-icon-search" style="color: #666666;"></i>
	      		<input v-model="listData.keyword" type="text" @focus="searchFocus" placeholder="搜索"/>
	      	</div>
	      	<div v-if="showDate" class="date" @click="dateSelect" > 
	      		<el-button icon="el-icon-date">日期</el-button>
	      	</div>
	      	<div v-else="showDate" style="line-height: 3;text-align: right;margin-right: 0.7rem;color: #5094f2;" @click="searchBtn">搜索</div>
	      </div>
	      
	      <div class="dateShow" v-if="rangeDate">
	      	<span class="date_time">{{listData.startdate}}至{{listData.enddate}}</span>
	      	<!--<span class="close">X</span>-->
	      </div>
	      
	      <div class="checkbox " @click="letsGetThisFuckingCheck">
	      	<span :class="isCheckAll?'selectImg':'checkImg'"></span>
	      	<span>选择全部</span>    
	      </div>
	      
	      <div class="search_main">
	      	<div class="search_contents">
	      		<ul>
	      			<div style="width: 100%;height: 0.01rem;"></div>
		      		<li v-for="(item, index) in tableData" :key="index" @click="check(item,index)">	
		      			<div style="margin: 0.34rem;">
			      			<div class="checkboxMain">
			      				<div class="checkboxImg"><span :class="checkbox.includes(index)?'selectImg':'checkImg'" ></span></div>
			      				<div class="checkboxTip">
			      					<span>{{item.date}}</span>
			      					<span>{{item.name}}</span>
			      				</div> 			      				
			      			</div>
			      			<div class="comSize">
			      				<span class="comSize_tip">员工</span>
			      				<span>{{item.username}} </span>
			      			</div>
			      			<div class="comSize">
			      				<span class="comSize_tip">已填工时</span>
			      				<span>{{item.fact_worktime}}</span>
			      			</div>
			      			<div class="comSize">
			      				<span class="comSize_tip">审核工时</span>
			      				 <span v-if="item.status == '2'" style="margin-left: 0.28rem;color:#929292">{{item.verify_worktime}}</span> 
			      				<input v-else type="text" class="input" style="margin-left: -0.05rem;border:#999999 0.01rem solid;border-radius: 0.05rem;;outline: none;"  v-model="item.verify_worktime" placeholder="">
			      			</div>
			      			<div class="comSpan">
			      				<span class="spanTip">工作内容</span>
			      				<span class="spanMain">{{item.content}}</span>
			      				<!-- <span class="spanMain" style="line-height: 0.48rem;">{{item.content}}</span> -->
			  				</div>
		  				</div>
		  				<div class="border"></div>
	      			</li>      
	      			
	      		</ul>
	      	</div>
	      </div>
			<div style="width: 100%;height: 3rem;background: #f7f7f7;"></div>
	      
	      <!--<div class="body">
	        <div class="search-handle">
	        	<div class="content">
		        	<el-row>
		        		  <el-col :span="2" style="line-height: 2;font-size: 0.16rem;">时间</el-col>
		        		  <el-col :span="7">
		        		  	<el-date-picker 
								      v-model="listData.startdate"
								      type="date"
								      format="yyyy-MM-dd"
	      							value-format="yyyy-MM-dd"
								      placeholder="选择日期">
								    </el-date-picker>
		        		  </el-col>
		        		  <el-col :span="2" style="color: #66666636;line-height: 2;font-weight: bold;">————</el-col>
		        		  <el-col :span="7" style="padding-left: 25px;">
		        		  	<el-date-picker
								      v-model="listData.enddate"
								      type="date"
								      format="yyyy-MM-dd"
	      							value-format="yyyy-MM-dd"
								      placeholder="选择日期">
								    </el-date-picker>
		        		  </el-col>
		        		  <el-col :span="6" style="padding-left: 140px;">
		        		  	<el-input
				              size="small"
				              placeholder="请输入关键字搜索"
				              v-model="listData.keyword"
				              @blur="Bulr"
				              class="search-box">
				              <i slot="suffix" class="el-input__icon el-icon-search"></i>
				            </el-input>
		        		  </el-col> 
		        	</el-row>             
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
	                <template slot-scope="scope">   
	                  <el-input v-model="scope.row.verify_worktime" placeholder=""></el-input>
	                </template>               
	              </el-table-column> 
	              <el-table-column
	                prop="content"
	                label="工作内容" >
	              </el-table-column>
	              <el-table-column 
	                label="操作" >
	                <template slot-scope="scope"> 
	                  <el-button @click="handleClick(scope.row)" type="text" size="small" >查看项目</el-button>                   
	                </template>
	              </el-table-column>
	            </el-table>
	          </transition>
	        </div>
	      </div>-->
	      <!--<div class="examine_sumbit">
	          <el-button @click="sumbit" type="primary" size="small" >审批提交</el-button>
	      </div>-->
	      <div class="sumbit"> 
	    		<div class="sum_btn">
						<button class="sum_left" style="background: #5094f3;color: #FFFFFF;" type="primary" @click="sumbit">提交</button>
					</div>
					<div style="width: 100%;height: 0.4rem;background: #f7f7f7;"></div>
	    	</div>
    	</div>
    	<div v-else class="dateRang"> 
    		  <div class="start">
		    		<div class="start_tip">开始时间</div>
		    		<div class="start_range">
		    			 <group class="group">
					      <datetime class="time" :arrow="false" v-model="listData.startdate" placeholder="请选择"/>
					    </group>
		    		</div> 
	    		</div>
	    		<div class="end">
		    		<div class="end_tip">结束时间</div>
		    		<div class="end_range">
		    			 <group class="group">
					      <datetime class="time" :arrow="false" v-model="listData.enddate" placeholder="请选择"/>
					    </group>
		    		</div> 
	    		</div>
	    		<div class="confirm">
	        		<span class="sumbitBtn cancel" @click="cancel">取消</span>
  					  <span class="sumbitBtn" style="color: #FFFFFF;background: #008cee;" type="primary" @click="confirm">确认</span>
	        </div>
    	</div>
    	
    </div>
  </div>
</template>

<script>
//	import { config, dingAuth } from '@/utils/mobileconfig'
  import NProgress from 'nprogress'
  import {list,approve} from '@/api/work'
  import {flex} from '../flexible.js'
  import {getUserId} from '@/utils/auth'
  import timechange from "../../utils/time"; 
  export default {
    name: 'moblieEx',
    data() {
      return { 
      	showDate:true,
      	rangeDate:true,
      	show:true,
      	date: null,
      	endate:null,
      	checkbox:[],
		    datalist:[],
      	listData:{
      		approveid:getUserId(),
   		// approveid:'122604106026256385',
	        type:'1',
	        startdate:timechange(new Date(new Date().getFullYear(), new Date().getMonth()-1, 1)),//上个月第一天
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
    computed: {

    //判断是否全部选中
    isCheckAll(){
      if((this.checkbox.length==this.tableData.length)&& this.checkbox.length >0){
        return true;
      }
      	return false;
      }
    },
    created() { 
//  	config();
//    dingAuth();
    	this.fit();
			this.getList();  
		},
    methods: { 
    	//搜索
    	searchFocus(){
    		this.showDate =false;
    		this.rangeDate = false;
    	},
    	searchBtn(){
    		this.listData.startdate = '';
    		this.listData.enddate = '';
    		this.getList();
    		let self=this;
    		if(self && !self._isDestroyed) {
            setTimeout(() => {
              if (self && !self._isDestroyed)
                  this.showDate = true;
            }, 1000);
        }  
    		
    	},
    	//取消时间
    	cancel(){
    		this.show = true; 
    	},
    	//确认时间
    	confirm(){
    		if (this.listData.startdate&&this.listData.enddate) {
    			this.show = true;
    			this.rangeDate = true;
    			this.getList();
    		}else{
    			 this.$message.error('请选择时间！');
    		}
    	},
    	check(item,index){ 
	      var idx = this.checkbox.indexOf(index);
	
	      //如果已经选中了，那就取消选中，如果没有，则选中 
	      if(idx>-1){
					this.$set(item, 'checked', false);
	        this.checkbox.splice(idx,1); 
	
	      }else{
					this.$set(item, 'checked', true);
	        this.checkbox.push(index); 
	      }
	      console.log(this.datalist)

     },
     letsGetThisFuckingCheck(){ 
      if(this.isCheckAll){ 
        this.clearCheckbox(); 
      }else{ 
        this.checkAll();
      }

    },
     //选中全部 
    checkAll(){ 
      var len = this.tableData.length; 
      this.checkbox = []; 
      for(var i=0;i<len;i++){
			this.$set(this.tableData[i], 'checked', true);
        this.checkbox.push(i);

      }
      this.datalist = this.tableData;
	     console.log(this.tableData)
    },
    clearCheckbox(){
      this.checkbox = [];
      this.datalist = [];
	    console.log(this.datalist)
    },
    	//日期选择
    	dateSelect(){
    		this.show = false
//  		this.$router.push('/dateRang')
    	},
    	//适配
	    fit(){
	        flex();
	    },
	    //查询
	    Bulr(){ 
	    	this.getList();
	    },
	    //审批列表
    	getList() { 
	        list(this.listData).then(res => {
	            // console.log(res)
	          if(res.code === 1){		
	            const data = res.data; 
	            this.tableData = data;
	            this.datalist = data;
	            this.tableData.map(item=>{ 
					      Object.assign(item,{
					          checked:false
					      })           
							})
							
							this.tableData.map((item, index) => {
		             if (Number(item.verify_worktime) > 0) {
		             		this.tableData[index].verify_worktime = item.verify_worktime; 
		             } else{
		             		this.tableData[index].verify_worktime = item.fact_worktime;
		             }
					    }); 
	            console.log(this.tableData); 
	          }
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
     			this.checkbox = []; 
					
      	}else if (tab.index == 1) {
      		this.listData.type = '2';
					this.getList();
      		this.checkbox = []; 
					
      	}else{
      		this.listData.type = '3';
					this.getList();
     			this.checkbox = []; 
					
      	}
        console.log(tab.index, event);
      },
      handleClick(row) {
        // console.log(row);
      },
      //审批提交操作
      sumbit() {
      	var checked = false;//要删除的id 
				var newArr = this.tableData.filter(function(obj){
				  return checked !== obj.checked;
				});
				//console.log(JSON.stringify(newArr));
      
      console.log(newArr) 
      	if (newArr.length > 0) {
      		newArr.map((item, index) => {
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
		            this.checkbox = []
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

<style lang='less' scoped> 
*{
	-webkit-tap-highlight-color:rgba(255,0,0,0);
}
@white: white;
.moblieEx {
  /*overflow-x: hidden;*/
  position: relative;
  background: #f7f7f7;
  height: 13rem;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  font-size: 0.26rem;
  .content {
    width: 100%;
    position: relative;
    .tabs-handle {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1;
      background: #fff;
      .tab{
      	.el-tabs__header{
	      	margin: 0 0 1px;
	      }
      }
      
    }
    .dateRang{
    	position: fixed;
    	background: #FFFFFF;
    	height: auto;
    	top: 1.3rem;
    	width: 100%;
    	.start{
    		display: flex;
    	  display: -webkit-box;
    	  .start_tip{
	    		text-indent: 0.34rem;
	    		flex: 1;
	    		-webkit-box-flex: 1;
	    		color: #222222;
	    		font-size: 0.3rem;
	    		line-height: 3;
	    	}
	    	.start_range{
	    		width: 2.5rem;
	    	}
	    	.group{
		    	margin: 0!important; 
		    }
    	}
    	.end{
    		border-top:#EDEDED 0.01rem solid ;
    		display: flex;
    	  display: -webkit-box;
    	  .end_tip{
	    		text-indent: 0.34rem;
	    		flex: 1;
	    		-webkit-box-flex: 1;
	    		color: #222222;
	    		font-size: 0.3rem;
	    		line-height: 3;
	    	}
	    	.end_range{
	    		width: 2.5rem;
	    	}
	    	.group{
		    	margin: 0!important; 
		    }
    	}
    	/*.date_tip{
    		text-indent: 0.34rem;
    		flex: 1;
    		-webkit-box-flex: 1;
    		color: #222222;
    		font-size: 0.3rem;
    		line-height: 3;
    	}
    	.range{
    		width: 2.5rem;
    	} 
	    .group{
	    	margin: 0!important; 
	    }*/
    	.confirm{
   			 position: fixed;
   			 left: 0;
   			 bottom: 0;
   			 z-index: 9999;
   			 width: 100%;
   			 height: 1.4rem;
   			 background: #FFFFFF;
   			.sumbitBtn{
   				width: 3.32rem;
   				height: 0.8rem;
   				line-height: 0.8rem;
   				text-align: center;
   				display: block;
   				float: left;
   				background: #FFFFFF;
   				font-size: 0.36rem;
   				color: #777777;
   				border-radius:5px ;
   				margin-right: 0.2rem;
   				cursor: pointer;
   				margin-top: 0.24rem;
   			}
   			.cancel{
   				margin-left: 0.32rem;
   				border: #EDEDED 0.01rem solid;
   			}
   		}
    }
    .data_search{
    	width: 100%;
    	height: 1rem;
    	background: @white;
    	margin-top: 45px;
    	display: flex;
    	display: -webkit-flex;
    	div{
		    -webkit-box-flex: 1;
		    -ms-flex: 1;
		    flex: 1;
		    font-size: .26rem;
    	}
    	.search{
    		margin-left: 12%;
    		input{  
    			-webkit-tap-highlight-color:rgba(255,0,0,0);
    			border: none;
    			outline:none; 
    			height: 0.7rem;
    			line-height: 0.7rem;
    			border-radius: 3px;
    			width: 60%;
    			/*float: left;*/
    			/*background-image: url(../image/search.png); 			
					background-position: 5px 4px; 				
					background-repeat: no-repeat; 		
					padding: 8px 10px 8px 40px; */
    		}
    		i{
    			float: left;
    			line-height: 1.9;
    			font-size: 0.38rem;
    			margin-right: 0.2rem;
    		}
    	}
    	.date{
    		button { 
	    		border: none;  
					outline:none; 
					color: #5094f2;
					background: @white;
					height: 0.75rem;
					/*background-image: url(../image/date.png);设置小图标 			
					background-position: 5px 4px;小图标在input的位置				
					background-repeat: no-repeat;背景小图标不重复			
					padding: 8px 10px 8px 40px;设置input内边距*/
			}
	    }
    }
    /**/
   .dateShow {
   		width: 100%;
   		height: 0.6rem;
   		background: #5094f2;
   		color: #FFFFFF;
   		line-height: 0.6rem;
   		.date_time{
   			margin-left: 0.34rem;
   		}
   		.close{
   			float: right;
   			margin-right: 0.34rem; 
		    height: 100%; 
		    text-align: center;
   		}
   		
   }
   .checkbox{
		width: 100%;
		height: 0.98rem;
		background: @white;
		font-size: 0.32rem;
		color: #222222;
		line-height: 0.98rem;
		margin: 0.3rem 0;
		.checkImg{
				background-image: url(../image/noCheck.png); 			
				background-position: 0.32rem 6px; 				
				background-repeat: no-repeat; 
				background-size: 0.4rem;		
				padding: 6px 10px 8px 0.8rem; 
				
		}
		.selectImg{
				background-image: url(../image/checked.png); 			
				background-position: 0.32rem 6px; 				
				background-repeat: no-repeat; 
				background-size: 0.4rem;		
				padding: 6px 10px 8px 0.8rem; 
				
		}
	} 
	.search_main{
		width: 100%;
		height: auto;
		background: #FFFFFF;
		// margin-bottom: 0.7rem;
		.search_contents{
			/*margin: 0.34rem;*/
			/*padding-bottom:0.5rem;*/
			ul,li{ 
				list-style-type:none;
				margin: 0;
				padding: 0;
			}
			.border{
				width: 100%;
				height: 0.2rem;
				background: #f7f7f7;
			}
			ul{
				/*padding-top: 0.5rem;*/
				.comSize{
					font-size: 0.32rem;
					color: #333333;
					margin-top: 0.26rem;
					margin-left: 0.7rem;
					span{
						display: block;
					}
					.comSize_tip{
						width: 1.3rem; 
						float: left;
						margin-right: 0.2rem;
						color: #929292;
					}
				}
				.comSpan{
					display: flex;
					display: -webkit-box;
					font-size: 0.3rem;
					color: #333333;
					margin-top: 0.26rem;
					margin-left: 0.7rem;
					.spanTip{
						display: block;
						width: 1.53rem; 
						color: #929292;
					}
					.spanMain{
						flex: 1;
						-webkit-box-flex: 1;
						display: block;
					}
				}
				.checkboxMain{
					font-size: 0.36rem;
					color: #222222;
					line-height: 0.62rem;
					display: flex;
					display: -webkit-flex;
					.checkboxImg{
						flex: 0 0 0.7rem;
						.checkImg{
								background-image: url(../image/noCheck.png); 			
								background-position: 0rem 6px; 				
								background-repeat: no-repeat; 
								background-size: 0.4rem;		
								padding: 5px 10px 8px 0.4rem; 							
						}
						.selectImg{
								background-image: url(../image/checked.png); 			
								background-position: 0rem 6px; 				
								background-repeat: no-repeat; 
								background-size: 0.4rem;		
								padding: 5px 10px 8px 0.4rem; 								
						}
					}
					.checkboxTip{
						flex: 1;
						-webkit-box-flex: 1;
					}
				}
			}
		}
	}
	.sumbit{
			background: #F7F7F7;
			width: 100%;
			height: auto;
			position: fixed;
			bottom: 0;
			z-index: 9999;
			/*display: flex;
			display: -webkit-flex;*/ 
			
			.sum_btn{  
				  background: #FFFFFF;
				  padding: 0.24rem 0;
					button{
						border: 0;
						display: block; 
					    height: 0.88rem;
					    width: 5.92rem;
					    border-radius: 8px; 
					    background: #f5f5f5;
					    font-size: 0.36rem; 
					    text-align: center;
					    margin: 0 auto;
					    
					} 
			}			
		}
    .examine_sumbit{
    	padding-left: 20px;
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

