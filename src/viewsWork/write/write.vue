<template>
	<div id="calender">
		<back-link />
	    <div class="main">	
			<div class="main_left"> 
				<div id="celender_head">
					<div class="head_main">
						<span   @click="left()"><i class="el-icon-arrow-left"></i></span>
						<span>
							{{header}}
						</span>
						<span  @click="right()"><i class="el-icon-arrow-right"></i></span>
					</div>
				</div>
				<div id="calender_body">
					<table>
						<tr class='head'>
							<td v-for="(head,hindex) in heads" :key="hindex">{{head}}</td>
						</tr>
						<!--<tr class="head_circle" v-for="item in show">
							<td  @click="chooseDate(item1,index)" :class="{now: item1.now,cirleRed:item1.all == chooseRed,last_month:item1.attr == 'last_month',next_month:item1.attr == 'next_month'}" v-for="(item1, index) in item" :key="index">{{item1.today}}
								<span :class="{cgreen:item1.green,noGreen:item1.all == chooseRed,circle:item1.attr == 'this_month'}"></span>
							</td>
						</tr>-->
						
						<tr class="head_circle" v-for="(item, sindex) in show" :key="sindex">
							<td v-for="(item1, pindex) in item" :key="pindex">
								<div @click="chooseDate(item1,pindex)" :class="{cirleRed:item1.all == chooseRed,last_month:item1.attr == 'last_month',next_month:item1.attr == 'next_month'}">{{item1.today}}</div>
								<span :class="{cgreen:item1.green,circle:item1.attr == 'this_month'}"></span>
								<!--<span :class="{cgreen:item1.green,noGreen:item1.all == chooseRed,circle:item1.attr == 'this_month'}"></span>-->							
							</td>
						</tr>
					</table>
				</div>
			</div>
	        <div class="main_left"  v-if="showList">
	        	<div style="overflow: auto;height: 6rem;margin-left: 50px;" >
		        	<div  style="margin: .3rem 0;" v-for="(main,index) in mainList" :key="index">
			        	<div class="projectList"> 
				        	<div style="line-height: 2;">
				        		{{main.name}}
				        	</div>
				        	<div>
				        		<div v-if="main.status == '0'">
				        			<input type="text" class="inputBlur"  @blur="Bulr(main)" v-model="main.worktime" placeholder=""/>
				        			<span>小时</span>
				        		</div>
				        		<div v-if="main.status == '1'" style="text-indent: 1.65rem;margin-top: 6px;">
				        			{{main.worktime}}小时
				        			<!--<input type="text" class="inputBlur" @blur="Bulr(main)" v-model="main.worktime" placeholder=""/>
				        			<span>小时</span>-->
				        		</div>
				        		<div v-if="main.status == '2'"  style="text-indent: 1.65rem;margin-top: 6px;">
				        			{{main.verify_worktime}}小时
				        			<!--<input type="text" class="inputBlur" @blur="Bulr(main)" v-model="main.worktime" placeholder=""/>
				        			<span>小时</span>-->
				        		</div>
				        	</div>
			        	</div>
			        	<div style="margin-top: 0.25rem;" v-if="main.status == '0'">
			        		<el-input
			        		  style="width: 85%;"
							  type="textarea"
							  :rows="1"
							  @blur = "BulrSome(main)"
							  placeholder="请输入工作事项..."
							  v-model="main.content">
							</el-input>
			        	</div>
			        	<div style="margin-top: 0.25rem;width: 80%;height: 1rem;line-height: 0.4rem;" v-if="main.status == '1'">
			        		{{main.content}}
			        	</div>
			        	<div style="margin-top: 0.25rem;width: 80%;height: 1rem;line-height: 0.4rem;" v-if="main.status == '2'">
			        		{{main.content}}
			        	</div>
			        	<div class="verify" v-if="main.status == '2'">审核后工时 {{main.verify_worktime}}小时</div>
		        	</div> 
	        	</div>
	        	<div class="sumbit">
	        		<span class="sumbitBtn" @click="preserve">保存</span>
  					<span class="sumbitBtn" style="color: #FFFFFF;background: #008cee;" type="primary" @click="sumbit">提交</span>
	        	</div>
	        </div>
	        <div class="tip" v-else>
	        	暂无需填写工时的项目
	        </div>
        </div>
		<!--<div id="calender_foot">
			<p @click="backToday">回到今天</p>
		</div>-->
	</div>
</template> 
<script> 
import NProgress from 'nprogress'
import backLink from '@/components/backLink'
import {flex} from '../flexible.js'
import { month ,userpro,useradd} from '@/api/work'
import { getUserInfo } from '@/api/user' 
import timechange from "../../utils/time";
import {getUserId} from '@/utils/auth'
//import { config, dingAuth } from '@/utils/mobileconfig'
export default {
	data() {
		return {
			showList:true,
			//提交信息
 			addInfo:{
		        userid:getUserId(),//用户id
//		        userid:this.$store.getters.userid,//用户id		        
		        // userid:'122604106026256385',
	            username:'',//用户名
	            date: timechange(new Date()),
	            type:'',
	            data:[{
	                pro_id:'',
	                pro_name:'',
	                fact_worktime:'',
	                content:'',
	                workid:'',
	                approver_id:'', 
	            }],
			},
			addInfo1:{
   				userid:getUserId(),
		        // userid:'122604106026256385',//用户id
	            username:'',//用户名
	            date:timechange(new Date()),
	            type:'',
	            data:[{
	                pro_id:'',
	                pro_name:'',
	                fact_worktime:'',
	                content:'',
	                workid:'',
	                approver_id:'', 
	            }],
		    }, 
		    sumTag:false,
		    id:getUserId(),//获取用户信息userid
		    // id:'122604106026256385',
			chooseRed: timechange(new Date()),
			mainList: [], 
			value1: '',
			body: '',
			header: '',
			currentYear: '',
			currentMonth: '',
			currentDay: '',
			heads: ["日", "一", "二", "三", "四", "五", "六"],
			datas: new Array(),
			show: new Array(),
			arr:new Array(),
			circle:{//红绿匹配
				userid:getUserId(),
				// userid:'122604106026256385',
				startdate:'',
				enddate:''
			}, 	
			chooseData:{
				userid:getUserId(),
				// userid:'122604106026256385',
				date : timechange(new Date()), 
			},
			bb:[],
			mustFill:true,
			str:[],
			someStr:[],
			preData:[],

		}
	},
	created() {  
		this.fit();
		this.setCalender(new Date());
		this.circle.startdate = this.arr[0].all;
		this.circle.enddate = this.arr.pop().all;
		this.getCircle(); 
		this.getInfo();
		this.getUserpro();  
		// console.log(this.datas)
		 
	},
	 mounted() { 
	  NProgress.done();
	  
   },
	components: {
      backLink, 
	}, 
	methods: {
		Bulr(main){
	    	if (!(/^[0-9]*[1-9][0-9]*$/).test(main.worktime)) {
	    		this.$message.error('请输入整数，且不能为空');
	    		main.worktime = ''
	    	}else{
				// if (main.content) {					
				// } else {
					this.str.push(main)
					// console.log(this.str)
				// }
				// console.log("是")
								
	    	}
		},
		BulrSome(main){
			if (main.worktime) { 
				this.str.push(main)
				// console.log(this.str)
			} else {
				this.$message.error('填写单个项目工时为必填'); 
				// main.content = '';
				// this.mustFill = true;
				// this.getUserpro();
				// this.getInfo();
			}
		},
		//获取用户信息
		getInfo() { 
	        getUserInfo(this.id).then(res => {
	            // console.log(res)
	            const data = res.data; 
	            this.addInfo.username = data.name;
	            // console.log(this.addInfo.username)
	        })
	         
	     },
		//点击选择日期
		chooseDate(item1,pindex){
			if (item1.attr == "this_month") {
				this.chooseRed = item1.all;  
				// console.log(this.chooseRed)
				this.addInfo.date = item1.all;
				this.chooseData.date = item1.all;
				this.getUserpro();
//				userpro(this.chooseData).then(res => {
//	            // console.log(res)
//		            const data = res.data;
//		            this.mainList = data; 
//		        })
				
			}
			
		},
		getUserpro(){
			userpro(this.chooseData).then(res => {
            // console.log(res)	            
	            if(res.code === 1){		 
				    const data = res.data;
	           	 	this.mainList = data; 
	           	 	if (this.mainList.length > 0) {
	           	 		this.showList = true;
	           	 	} else{
	           	 		this.showList = false;
						}
						
						data.map((item,index)=>{
							if(item.status === "0" && item.workid > 0){
								this.preData.push(data[index])
							}
						})
						this.preData = this.deteleObject(this.preData);

				}
	            
	        })
		},
		//获取圆点接口
		getCircle() { 
	        month(this.circle).then(res => {
	            // console.log(res)
	            const data = res.data; 
	            this.bb = res.data;
	            //红绿匹配
				this.choose();
	        })
	         
		},
		// 去除重复项
		deteleObject(obj) {
			var uniques = [];
			var stringify = {};
			for (var i = 0; i < obj.length; i++) {
				var keys = Object.keys(obj[i]);
				keys.sort(function(a, b) {
					return (Number(a) - Number(b));
				});
				var str = '';
				for (var j = 0; j < keys.length; j++) {
					str += JSON.stringify(keys[j]);
					str += JSON.stringify(obj[i][keys[j]]);
				}
				if (!stringify.hasOwnProperty(str)) {
					uniques.push(obj[i]);
					stringify[str] = true;
				}
			}
			uniques = uniques;
			return uniques;
		},
        //保存操作
        preserve(){
			// console.log(11111)
			// console.log(this.deteleObject(this.str))			
			this.addInfo.type = "1";
        	this.sumAjax();
        }, 
        //提交操作
        sumbit(){
			this.addInfo.type = "2";
        	this.workAjax(); 			
        	// this.sumAjax(); 
		},  
		sumA(){
			this.addInfo.data = JSON.stringify(this.addInfo.data); 
			console.log(this.addInfo)
			
		},  
        //工时保存接口
		sumAjax(){  
			// console.log(this.str)
			this.someStr =  this.deteleObject(this.str);
			// console.log(2222)
			// console.log(this.someStr)

			if (this.someStr.length > 0) {		 
				this.addInfo.data = this.someStr.map((item, index) => {
					return {
					   pro_id:item.pro_id,
					   pro_name:item.name,
					   fact_worktime:item.worktime,
					   content:item.content,
					   workid:item.workid,
					   approver_id:item.approver,
				    } 
				}); 
				let fact_worktime = '';//要删除的元素
				let newArr = this.addInfo.data.filter(function(obj){
					return fact_worktime !== obj.fact_worktime;
				});
				this.addInfo.data = newArr;
				// console.log(this.addInfo.data);
				// console.log(this.addInfo)
	//			console.log(this.sumTag)
				this.addInfo.data = JSON.stringify(this.addInfo.data); 
				// console.log(this.addInfo)
				if (newArr.length > 0) {
					// console.log('提交')
					useradd(this.addInfo).then(res => {
						if(res.code === 1){				
						// console.log(res)
							const data = res.data; 
							this.addInfo.data = JSON.parse(this.addInfo.data);
							this.fit();
							//
							// this.setCalender(new Date());
							this.circle.startdate = this.arr[0].all;
							this.circle.enddate = this.arr.pop().all;
							this.getCircle(); 
							this.getInfo();
							this.getUserpro();
							this.$message({
							message: '成功',
							type: 'success'
							});
							this.str = []; 
							//
						}else{
							this.$message.error('提交失败！');
						}
					})
				} else{
					// this.$message.error('工时未填写！');
				}

			} else {
				this.$message.error('请填写');	
			} 	
		},
		//工时提交接口
		workAjax(){  
			// console.log(this.str) 
			let _self = this;
			// console.log('start')
			_self.someStr =  this.deteleObject(this.str);
			// console.log(this.someStr)
			// if (this.someStr.length > 0) {	 
        //    if (_self.preData.length > 0) {
           	    if (_self.someStr.length > 0) {
					_self.addInfo.data = _self.someStr.map((item, index) => {
						return {
							pro_id:item.pro_id,
							pro_name:item.name,
							fact_worktime:item.worktime,
							content:item.content,
							workid:item.workid,
							approver_id:item.approver,
						}   
					});  
					var fact_worktime = '';//要删除的元素
					var newArr = this.addInfo.data.filter(function(obj){
						return fact_worktime !== obj.fact_worktime;
					});
				} 
				console.log(_self.preData)
           		if (_self.preData.length > 0) {
				// console.log(123)

					this.addInfo1.data = this.preData.map((item, index) => {
						return {
							pro_id:item.pro_id,
							pro_name:item.name,
							fact_worktime:item.worktime,
							content:item.content,
							workid:item.workid,
							approver_id:item.approver,
						} 
					});
		   		}else{
					this.addInfo1.data = [];
				}
				// console.log(this.addInfo1.data)
				// console.log(newArr)
				if (newArr) {
					this.addInfo.data = this.addInfo1.data.concat(newArr);
					// console.log('存在') 		
					// console.log(this.addInfo.data) 					
				} else {
					this.addInfo.data = this.addInfo1.data; 
					// console.log('不存在') 									
					// console.log(this.addInfo.data) 						
				}
				this.addInfo.data = JSON.stringify(this.addInfo.data); 
				console.log(this.addInfo)
				if ((newArr && newArr.length > 0) || this.preData.length > 0) {				
					// console.log('提交')
					useradd(this.addInfo).then(res => {
						if(res.code === 1){				
						// console.log(res)
							const data = res.data; 
							// this.addInfo.data = JSON.parse(this.addInfo.data);
							this.fit();
							//
							// this.setCalender(new Date());
							this.circle.startdate = this.arr[0].all;
							this.circle.enddate = this.arr.pop().all;
							this.getCircle(); 
							this.getInfo();
							this.getUserpro();
							this.$message({
							message: '成功',
							type: 'success'
							});
							this.str = [];
							this.preData = []; 
							this.addInfo.data = [];

							//
						}else{
							this.$message.error('提交失败！');
						}
					})
				} else{
					this.$message.error('信息未填写！');
				}

			// } else {
			// 	this.$message.error('请填写');	
			// }



			
		},

		//红绿点
		choose(){
			let _tag = false;
			let _this =this;
			_this.datas.forEach(function(index) {
				_tag = false;			
				if(index.all){ 
					_this.bb.forEach(function(item) {
	//			  	console.log(index.all)
//				  	console.log(item)
				    if (item == index.all) {
				      _tag  = true;
					}
					});
					if(_tag){
					    _this.$set(index, 'green', true); 
					} else {
					    _this.$set(index, 'green', false);
					}
				}												
			});
		},
		//适配
	    fit(){
	        flex();
	    },
		//》》》时间控件start《《《
		initline() {
			this.datas = new Array()
			this.show = new Array();
			this.arr = new Array();

		},
//		backToday() {
//			this.setCalender(new Date())
//		},
		getcurrentDates(calender_Date) { //传入正常的Date（）类型数据
			this.initline()
			var months = calender_Date.getMonth();
			months = months + 1;
			calender_Date.setMonth(months);
			calender_Date.setDate(0)

			return calender_Date.getDate();
		},
		getlastDates(calenderdDate) { //传入正常的Date（）类型数据
			var curDate = calenderdDate;
			curDate.setDate(0);
			return curDate.getDate();
		},
		left() {
			this.initline()
			var yy = this.currentYear;
			var mm = this.currentMonth;
			var dd = 1
			if(yy == new Date().getFullYear() && mm == new Date().getMonth() + 1) {
				dd = new Date().getDate();
			}
			if(mm == 0) {
				mm = 12;
				yy = yy - 1;
				this.currentMonth = mm;
				this.currentYear = yy;
			}
			var calenderrDate = yy + "-" + mm + "-" + dd;
			this.setCalender(new Date(calenderrDate));
			this.circle.startdate = this.arr[0].all;
			this.circle.enddate = this.arr.pop().all;
			this.getCircle();
			this.choose();
			this.chooseData.date = this.arr.pop().all;
			this.preData = [];
			this.getUserpro();
		},
		right() {
			this.initline()
			var yy = this.currentYear;
			var mm = this.currentMonth + 2;
			var dd = 1
			if(yy == new Date().getFullYear() && mm == new Date().getMonth() + 1) {
				dd = new Date().getDate();
			}
			if(mm > 12) {
				mm = 1;
				yy++;
				this.currentMonth = mm;
				this.currentYear = yy;
			}
			var calender__Date = yy + "-" + mm + "-" + dd;
			this.setCalender(new Date(calender__Date));
			this.circle.startdate = this.arr[0].all;
			this.circle.enddate = this.arr.pop().all;
			this.getCircle();
			this.choose();
			this.chooseData.date = this.arr.pop().all;
			this.preData = [];
			this.getUserpro();
			// console.log(this.arr)
		},
		setCalender(dateNow) {
			//显示日历部分
			var firstday;
			var today = dateNow;
			var yy = today.getFullYear();
			this.currentYear = yy;
			var mm = today.getMonth() + 1; //today=2;mm=3
			this.currentMonth = mm - 1; //this.curr=2
			var dd = today.getDate();
			this.currentDay = dd; //30
			firstday = yy + "-" + mm + "-1"; //2018-3-1
			//本月第一天是星期几,也表示前面有几个空的天数
			var firstday_day = new Date(firstday).getDay();
			//日历头
			this.header = yy + "年" + mm + "月";
			var cur_days = this.getcurrentDates(today);
			//上一月有多少天
			var last_days = this.getlastDates(dateNow);

			//上个月从哪天开始出现
			var last_first_day = last_days - firstday_day + 1;
			//firstline
			//存上个月的日期
			for(var i = last_first_day; i <= last_days; i++) {
				var date = new Object();
				date.num = i;
				date.attr = 'last_month'
				date.now = false
				this.datas.push(date);
				// this.dateData.firstline.push(date);
			}
			//temp存放换行前上一个数据
			//下一行第一个数字
			var num_second = 7 - firstday_day + 1;
			//存本月日期
			for(var i = 1; i <= cur_days; i++) {
				var date = new Object();
				date.num = i; 
				date.today = i;
				var allmm;
					if (mm < 10) {
						allmm = '0' + mm
					} else {
						allmm = mm
					}
				if (i < 10){
					date.all = yy + "-" + allmm + "-" + "0"+ i;
				}else{
					date.all = yy + "-" + allmm + "-" + i;
				} 
				date.attr = 'this_month';
//				date.green = false
				if(i == this.currentDay && this.currentMonth == new Date().getMonth() && this.currentYear == new Date().getFullYear()) {
					date.now = true;  
				} else {
					date.now = false; 
				}
				this.datas.push(date);
				this.arr.push(date);
			}
			for(var i = 1; i <= 42 - cur_days - (last_days - last_first_day + 1); i++) {
				var date = new Object();
				date.num = i;
				date.attr = 'next_month'
				this.datas.push(date);
			}

			var k = 0;
			for(var i = 0; i < 6; i++) {
				var line = new Array();
				for(var j = 0; j < 7; j++) {
					line.push(this.datas[k++]);
				}
				this.show.push(line);
			}

		}
	//》》》时间控件end《《《

	}
}
</script>

<style lang="less" scoped>
	@red: red;
	@gray: rgb(248, 248, 248);
	#calender { 
		position: relative;
		font-size: 0.24rem; 
		
		/*top: 73rem;
    left: 939rem;*/ 
       .main{
	       	display: flex;
			display: -webkit-flex;
			margin: 0.4rem;
       		.main_left{
       	  		flex: 1;
       	  		-webkit-box-flex: 1;
       	  		.projectList{
       	  			display: flex;
					display: -webkit-flex;
					div{
						flex: 1;
       	  				-webkit-box-flex: 1;
					}
					.inputBlur{
					    border: 1px #ccc solid;
					    height: 30px;
					    width: 40px;
					    border-radius: 5px;
					    margin-left: 60px;
					    outline: none;
					    text-align: center;
					}
       	  		}
       		}
       		.verify{
       			margin-top: 0.15rem;
       			font-size: 0.22rem;
       			color: #5abf97;
       			background-image: url(../image/work.png); 			
				background-position: 5px 4px; 				
				background-repeat: no-repeat; 
				background-size: 0.25rem 0.25rem;		
				padding: 3px 0px 4px 25px; 
       		}
       		.tip{
   			    width: 100%;
			    text-align: center;
			    color: #666666;
			    display: flex;
			    align-items: center;
			    justify-content: center;
       		}
       		.sumbit{
       			margin-top: 1rem;
       			margin-left: 50px;
       			.sumbitBtn{
       				width: 140px;
       				height: 40px;
       				line-height: 40px;
       				text-align: center;
       				display: block;
       				float: left;
       				background: #f1f1f1;
       				color: #777777;
       				border-radius:5px ;
       				margin-right: 20px;
       				cursor: pointer;
       			}
       		}
       }
       
		#celender_head {
			height: 1rem; 
			line-height: 1rem; 
			.head_main{
				position: absolute; 
    			left: 3rem;
				text-align: center; 
				i{
					font-size: 16px;
					cursor: pointer;
				}
				.el-icon-arrow-right{
					color: #409EFF;
				}
				.el-icon-arrow-left{
					color: #409EFF;
				}
			}
			.celender_head {
				line-height: .40rem;
				text-align: center;
				height: .40rem;
			}
			#left {
				/*height: .40rem;*/
				width: 20%;
				float: left;
				line-height: 1rem;
			}
			#celender_head_inner {
/*				height: .40rem;*/
				width: 60%;
				float: left; 
			}
			#right {
				/*height: .40rem;*/
				width: 20%;
				float: left;
				line-height: 1rem; 
			}
			p{
				color: white;
				font-size: .10rem;
				text-align: center;
			}
		}
		#calender_body { 
			.head td:hover {
				background-color: #FFFFFF;
				color: #000000;
			}
			.head{
				color: #8d8d8d;
				td:hover{
					color: #8d8d8d; 
				}
			}
			.head_circle td{
				.circle{
					width: 0.07rem;
					height: 0.07rem;
					background: #e64946;
					border-radius: 50%;
					position: absolute;
					left: 47%;
    				top: 0.68rem;
				} 
				.cgreen{
					background: #01c43d;
				}
				.noGreen{
					width: 0;
					height: 0;
				}
			}
			td {
				/*cursor: pointer;
				position: relative;
				width: 0.5rem;
				height: 0.5rem;
				text-align: center;
				line-height: 0.5rem;
				border-radius: 50%;
				
				&:hover { 
					background-color: @red;
					color: #FFFFFF;
					.circle{
						width: 0;
						height: 0;
					}
				}
				&.now {
					color: dodgerblue;
				}*/
				-webkit-tap-highlight-color:rgba(0,0,0,0);/*去掉点击时出现的背景高亮*/
				cursor: pointer;
				position: relative; 
				text-align: center; 
				padding:0.1rem 0.2rem; 
				font-size: 0.28rem;
				div{ 
				    width: 0.6rem;
				    height: 0.7rem;
				    display: block;
				    line-height: 0.6rem; 
					.circle{
						width: 0;
						height: 0;
					}
				}
				div:hover {
					/*滑过红圆*/ 
				    border-radius: 3px;
					background-color: #5094f2;
					color: #FFFFFF;
					.circle{
						width: 0;
						height: 0;
					}
				}
			    .now {
					color: #FFFFFF;
					background: #5094f2;
					border-radius:3px ;
				}
				
			}
			.cirleRed{
				width: 0.6rem;
			    height: 0.7rem;
			    display: block;
			    line-height: 0.6rem;
			    border-radius: 3px;
				background-color: #5094f2;
				color: #FFFFFF;
			}
			.noRed{
				background-color: #FFFFFF;
			}
			.last_month {
				color: lightgray;
				height: 0;
				width:0; 
				&:hover {
					background-color: #FFFFFF;
				}
			}
			.next_month {
				height: 0;
				width:0; 
				color: lightgray;
				&:hover {
					background-color: #FFFFFF
				}
			}
		}
		#calender_foot {
			background-color: @gray;
			text-align: center;
			line-height: .40rem;
			p {
				color: blue;
				font-size: .10rem;
			}
		}
	}
</style>