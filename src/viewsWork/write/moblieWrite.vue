<template>
	<div class="bodyMain">
	<div id="calender">
	    <div style="background: #FFFFFF;">	
			<div>  
				<div id="calender_body">
					<div class="flex">  
				        <div> 
				            <calendar
				                ref="calendar1"
				                :events="calendar1.events" 
				                :lunar="calendar1.lunar" 
				                :value="calendar1.value" 
				                :begin="calendar1.begin" 
				                :end="calendar1.end" 
				                :weeks="calendar1.weeks" 
				                :months="calendar1.months"
								@sdata='getinputdata' 
				                @select="calendar1.select"
				                @selectMonth="calendar1.selectMonth"
				                @selectYear="calendar1.selectYear">
				            </calendar> 
				        </div>
				 
				    </div> 
				</div>
			</div>
        </div>
        <div>
        	<div class="line"></div>
        </div>
        <div>        	 
	        <div>
	        	<div style="overflow: auto;" >
		        	<div v-for="(main,index) in mainList" :key="index">
		        		<div style="padding: 0 0.32rem;background: #FFFFFF;">
				        	<div style="padding-top: 0.1rem;">  
					        	<div>
					        		<p class="name_p">{{main.name}}</p> 
					        	</div>
				        	</div> 
				        	<div v-if="main.status == '0'" style="margin: 0.45rem 0 0 0.64rem;display: flex;display: -webkit-flex;">
					        	<!-- <div  class="time" style="width: 2.5rem;" v-if="main.status == '0'"> -->
					        	<div  class="time">
					        		填写工时(小时)
					        	</div> 
					        	<div style="flex: 1;-webkit-box-flex: 1;">
					        		<input type="text" class="input" @focus="focusSome" @blur="Bulr(main)" v-model="main.worktime" placeholder="请输入">
					        	</div>
					        	 
				        	</div>

							<div class="writeDis" style="padding-bottom: 0.1rem;padding-top: 0.3rem;" v-if="main.status == '1'"> 
								<div  class="workTitle">
					        		填写工时 :
					        	</div> 
					        	<div  class="workMian">
									{{main.worktime}}小时  
				        		</div> 
				        	</div>

							<div class="writeDis" style="padding-bottom: 0.1rem;padding-top: 0.3rem;" v-if="main.status == '2'"> 
								<div class="workTitle">
					        		填写工时 :
					        	</div> 
				        		<div  class="workMian">
				        			{{main.verify_worktime}}小时
				        		</div>
				        	</div>
				        	<div class="border" v-if="main.status == '0'"></div>
							<div v-if="main.status == '0'">
								<div class="workSome">
									工作事项
								</div>
								<div style="padding-bottom:1rem ;">
									<input class="inputText" @focus="focusAny(main)"  @blur="BulrSome(main)" v-model="main.content" placeholder="请输入"/>
								</div> 
							</div>
							<div class="writeDis" v-if="main.status == '1'">
								<div class="workTitle">
									工作事项 :
								</div>
								<div class="workMian">
									{{main.content}} 
								</div> 
							</div>
							<div class="writeDis" v-if="main.status == '2'">
								<div class="workTitle">
									工作事项 :
								</div>
								<div class="workMian">
									{{main.content}} 
								</div> 
							</div> 

				        	<div v-if="main.status == '2'" class="verifyOne" >审核后工时: {{main.verify_worktime}}小时</div>
			        	</div>
			        	<div style="background: #f7f7f7;width: 100%;height: 0.3rem;"></div>
		        	</div>  
	        	</div>
	        	
	        </div>
        </div>
        <div style="background: #f7f7f7;width: 100%;height: 4rem;"></div>
		<div v-if="showIos">
			<div class="sumbit" v-show="butShow">
				<div class="sum_btn">
					<button class="sum_left" style="color: #222222;"  @click="preserve">保存</button>
				</div>
				<div class="sum_btn">
					<button class="sum_left" style="background: #5094f3;color: #FFFFFF;margin-left: 0.2rem;" type="primary" @click="sumbit">提交工时</button>
				</div>
			</div>	
		</div>
		<div v-else>
			<div class="sumbit" v-show="isOriginHei">
				<div class="sum_btn">
					<button class="sum_left" style="color: #222222;"  @click="preserve">保存</button>
				</div>
				<div class="sum_btn">
					<button class="sum_left" style="background: #5094f3;color: #FFFFFF;margin-left: 0.2rem;" type="primary" @click="sumbit">提交工时</button>
				</div>
			</div>
		</div>
       
		<!--<div id="calender_foot">
			<p @click="backToday">回到今天</p>
		</div>-->
	</div>
</div>
</template> 
<script> 

 import NProgress from 'nprogress'
import calendar from './calendar.vue'
import {flex} from '../flexible.js'
import { month ,userpro,useradd} from '@/api/work'
import { getUserInfo } from '@/api/user' 
import timechange from "../../utils/time";
import {getUserId} from '@/utils/auth'
//import { config, dingAuth } from '@/utils/mobileconfig'
export default {
	 components: {
        calendar
    },
	data() {
		return {
			showIos:true,
			isOriginHei: true,
			screenHeight: document.documentElement.clientHeight,        
			originHeight: document.documentElement.clientHeight, 
			butShow:true,									
			calendar1:{
                value:[], //默认日期
//              lunar:true, //显示农历
                weeks:['日', '一', '二', '三', '四', '五', '六'],
                months:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                select(value){                    
                    console.log(value);
                     
                },
                selectMonth(month,year){
                    console.log(year,month)
                },
                selectYear(year){
                    console.log(year)
                },
                timestamp:Date.now()
        	},
			//提交信息
 			addInfo:{
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
   			id:getUserId(),		    
		    // id:'122604106026256385',//获取用户信息userid
			chooseRed:-1,
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
				// userid:'122604106026256385',
				userid:getUserId(),
				startdate:'',
				enddate:''
			}, 	
			chooseData:{
				// userid:'122604106026256385',
				userid:getUserId(),
				date : timechange(new Date()), 
			},
			allDate:'',
			getYear:'',
			getMonth:'',
			getDay:'',
			bb:[],
			aa:[],
			str:[],
			someStr:[],
			preData:[],
			circle:{//红绿匹配
				userid:getUserId(),
				// userid:'122604106026256385',
				startdate:'',
				enddate:''
			},
			cirData:[]


		}
	},
	created() {  
		this.fit(); 
//		this.getCircle(); 
		this.getInfo();  
		this.getUserpro(); 
		// console.log(localStorage.getItem("startdate"))
	},
	mounted() {
		 if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
		//判断是ios用户的时候执行某种操作 
			this.showIos = true;
			document.body.addEventListener('focusin', () => {
            //软键盘弹出的事件处理
				// alert('ios弹出')
				this.butShow = false;												
			})
			document.body.addEventListener('focusout', () => {
			//软键盘收起的事件处理
			// alert('ios收起')
				this.butShow = true;												         
			})
		} else if (/(Android)/i.test(navigator.userAgent)) {
			// alert('安卓')
		//判断是安卓用户的时候执行某种操作 				 
			this.showIos = false;
			let self = this;
            window.onresize = function() {
                return (function(){
                    self.screenHeight = document.documentElement.clientHeight;
                })()
            } 
		}

		 
		NProgress.done();
		this.$nextTick(() => {
		    this.$refs.calendar1.$on('select', (value) => {
		    	//选择时间
				this.allDate = value;
				this.getYear = this.allDate[0];
				if (this.allDate[1] < 10) {
					this.getMonth = '0' + this.allDate[1];
				} else{
					this.getMonth = this.allDate[1];
				}
				if (this.allDate[2] < 10) {
					this.getDay = '0' + this.allDate[2];
				} else{
					this.getDay = this.allDate[2];
				} 
				this.addInfo.date = this.getYear + '-' + this.getMonth + '-' + this.getDay;
				this.chooseData.date = this.getYear + '-' + this.getMonth + '-' + this.getDay;
				this.preData = [];
				this.getUserpro();
//				console.log(this.addInfo.date)  
		    });
		    
		    this.$refs.calendar1.$on('selectMonth', (month,year) => {
		    	//选择时间 
				if (month < 10) {
					this.chooseData.date = year + '-' + '0' + month + '-' + 28;
				} else{
					this.chooseData.date = year + '-' + month + '-' + 28;
				}   
				this.preData = [];
				this.getUserpro();
				// console.log(month,year)  
		    });
		    
		    
		}) 
	},
	watch:{
		screenHeight (val) {
            if(this.originHeight > val + 100) {        //加100为了兼容华为的返回键
                this.isOriginHei = false;
            }else{
				this.isOriginHei = true;
				// alert('出现')
            }
        } 
	},
	methods: {	 
		// 获取当前所有日期
		getinputdata(sdata) { 
			this.cirData = sdata; 
        }, 
		Bulr(main){

			this.butShow = false;
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
			// let self=this;
			// if(self && !self._isDestroyed) { 
			// 	setTimeout(() => {
			// 		if (self && !self._isDestroyed) 
			// 		this.butShow = true;									
			// 	}, 500);
			// }  
		},
		BulrSome(main){

			this.butShow = false;
			if (main.worktime) { 
				this.str.push(main)
				// console.log(this.str)
				// let self=this;
				// if(self && !self._isDestroyed) { 
				// 	setTimeout(() => {
				// 		if (self && !self._isDestroyed) 
				// 		this.butShow = true;									
				// 	}, 500);
				// }  
			} else {
				this.$message.error('填写单个项目工时为必填'); 
				// // main.content = '';
				// this.mustFill = true;
				// this.getUserpro();
				// this.getInfo();
			}
			
		},
		focusSome(){
			// alert('huo') 
			const _this = this;
			_this.butShow = false;
		},
		focusAny(main){
			// alert('huo') 
			const _this = this;
			_this.butShow = false;
		},
	    //点击获取列表
	    getUserpro(){
	    	userpro(this.chooseData).then(res => {
            // console.log(res)
				const data = res.data;
				data.map((item,index)=>{
					if(item.status === "0" && item.workid > 0){
						this.preData.push(data[index])
					}
				})
				this.preData = this.deteleObject(this.preData);
				// console.log(this.preData)
				
	            if(res.code === 1 && data.length >0 ){
					this.mainList = data; 									 
	            }else{
	            	this.mainList = [];
	            } 
	        })
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
        	this.addInfo.type = "1";
        	this.sumAjax(); 
        	
        }, 
        //提交操作
        sumbit(){
			this.addInfo.type = "2";  
        	this.workAjax(); 
        },    
        //工时保存接口
		sumAjax(){  
//			console.log(this.mainList)
//			console.log(this.addInfo.data)
			this.someStr =  this.deteleObject(this.str);

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
				// console.log(this.addInfo.data)
           	    let fact_worktime = '';//要删除的元素
				let newArr = this.addInfo.data.filter(function(obj){
					return fact_worktime !== obj.fact_worktime;
				});
				this.addInfo.data = newArr; 
				this.addInfo.data = JSON.stringify(this.addInfo.data);  
				if (newArr.length > 0) {
					// this.addInfo.date = this.addInfo.date;
					// this.addInfo.userid = this.addInfo.userid;
					// console.log(this.addInfo)
					useradd(this.addInfo).then(res => {
						if(res.code === 1){	 
							const data = res.data; 
							this.addInfo.data = JSON.parse(this.addInfo.data);
							this.fit();
							// 
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
					this.$message.error('工时未填写！');
				}
           	   
           }else{
           	//   this.$message.error('无数据');
           }
            
			
		},
		 //工时提交接口
		workAjax(){  
			let _self = this;
			// console.log('start')
			_self.someStr =  this.deteleObject(this.str);
			// console.log(this.someStr)
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
				// console.log(_self.preData)
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
				} else {
					this.addInfo.data = this.addInfo1.data; 					
				}
				this.addInfo.data = JSON.stringify(this.addInfo.data);  
				// this.addInfo = this.addInfo.concat(this.preData);
				// console.log('hihihi')
				// console.log(this.preData)
				if ((newArr && newArr.length > 0) || this.preData.length > 0) {
					// console.log('提交')
					useradd(this.addInfo).then(res => {
						if(res.code === 1){	 
							const data = res.data; 
							this.addInfo.data = JSON.parse(this.addInfo.data);
							this.fit();
							// 
							this.getInfo();
							this.getUserpro();
							this.$message({
							message: '成功',
							type: 'success'
							}); 
							this.str = [];
							this.preData = []; 							 
							//红绿匹配
							this.showGreen();
						}else{
							this.$message.error('提交失败！');
						}
					})


				} else{
					this.$message.error('信息未填写！');
				}
           	   
        //    }else{
        //    	//   this.$message.error('无数据');
        //    }
            
			
		}, 
		//适配
	    fit(){
	        flex();
	    },
		//  红绿匹配变色
		showGreen(){
			this.circle.startdate = localStorage.getItem("startdate");
			this.circle.enddate = localStorage.getItem("enddate");   			  
	        month(this.circle).then(res => {
	            // console.log(res)
	            const data = res.data; 
	            this.bb = res.data;
	            //红绿匹配
				let _tag = false;
				let _this =this;
				// 匹配
				this.cirData.map((item, index) => { 
					// console.log(item)				
					item.forEach(function(index) {
						_tag = false;			
						if(index.all){						
							// console.log(_this.bb)
							_this.bb.forEach(function(item) {
							// console.log(index.all)
							// console.log(item)
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
				});
	        }) 
		}

	}
}
</script> 
<style lang="less" scoped>   
	* { 
		-webkit-tap-highlight-color:rgba(0,0,0,0);/*去掉点击时出现的背景高亮*/
		touch-action: pan-y; 
		font-family: "微软雅黑";
	} 
	@red: red;
	@gray: rgb(248, 248, 248);
	.bodyMain{
		background: #f7f7f7;
		height: 18rem;
		/*overflow-x: hidden;*/
		-webkit-overflow-scrolling: touch;
	}
	::-webkit-scrollbar {/*隐藏滚轮*/
		display: none;
	}
	@media screen and (max-width:320px){
		#calender #calender_body td div{
		 	width: 0.5rem!important;
		}
		.sum_left{
			margin-left: 0.1rem!important;
			outline: none;
		}
	}
	#calender {  
		.writeDis{
			display: flex;
			display: -webkit-flex;
			margin-left: 0.64rem;
			color: #999999;
			font-size: 0.28rem;
			padding-bottom: 0.32rem;
			line-height: .44rem;
			// margin-top: -0.2rem;
			.workMian{
				flex: 1;
				-webkit-box-flex: 1;
				margin-left: 0.15rem;
				word-break: break-all;
			}
		}
		.verifyOne{
   			// margin-top: 0.15rem;
   			font-size: 0.28rem;
   			color: #5abf97;
   			background-image: url(../image/work.png); 			
			// background-position: 5px 3px;
		    background-repeat: no-repeat;
		    background-size: 0.4rem 0.4rem;
			padding: 3px 0px 24px 25px;
			margin-left: .64rem;
   		}
		.time{
			font-size: .32rem; 
		    // margin-top: 0.18rem;
		    margin-top: 0.12rem;
		    color: #666666;
		}
		.workSome{
			font-size: 0.32rem;
			margin-left: 0.64rem;
			color: #666666;
		}
		.border{
			border: #ededed 0.01rem solid;
			margin: 0.34rem 0.75rem 0.36rem 0.64rem;
		}
		.sumbit{
			background: #FFFFFF;
			width: 100%;
			height: 1.4rem;
			position: fixed;
			bottom: 0;
			z-index: 9999;
			display: flex;
			display: -webkit-flex;
			align-items: center;
			.sum_btn{
				flex: 1; 
					button{
						border: 0;
						display: block; 
					    height: 0.88rem;
					    width: 3.55rem;
					    border-radius: 8px; 
					    background: #f5f5f5;
					    font-size: 0.36rem;
				        margin-left: 0.4rem;
						outline: none; 
					} 
			}			
		}
		.input,.inputText{
			border: 0;
			outline:none;
		    display: block;
		    /*width: 88%;*/
		    height: 0.6rem;
		    text-align: right;
		    font-size: 0.34rem;
		    outline: none;
		}
		.inputText{
			text-align: left;
			height: 1rem;
			line-height: 0.5rem;
			margin: 0 0 0rem 0.64rem;
		}
		position: relative;
		font-size: 0.24rem; 
		font-family: "微软雅黑"; 
		.name_p{
			font-weight: bold;
			margin-top: 0.4rem;
			line-height: 0.6rem;
			font-size: 0.36rem;
			word-break: break-all;
			color: #222222;
			background-image: url(../image/arrow.png);/*设置小图标*/ 			
			// background-position: 5px 4px;/*小图标在input的位置*/				
			background-position: 0px 7px;/*小图标在input的位置*/				
			background-repeat: no-repeat;/*背景小图标不重复*/				
			padding-left: 0.64rem;/*设置input内边距*/
			background-size: 0.4rem 0.4rem;
		}
		.line{
			width: 100%;
			height: 0.3rem;
			background: #f7f7f7;
		}
		#celender_head {
			margin: 00.34rem;
			font-size: 0.32rem;
			color: #666666;
			height: 0.6rem; 
			line-height: 0.6rem; 
			margin-bottom:0.1rem;
			.celender_head { 
				text-align: center; 
			}
			#left {
				/*height: .40rem;*/
				width: 20%;
				float: left;
				line-height: 0.6rem;
			}
			#celender_head_inner {
				height: .40rem;
				width: 60%;
				float: left;  
				color: #222222;
			}
			#right {
				/*height: .40rem;*/
				width: 20%;
				float: left;
				line-height: 0.6rem; 
			} 
		}
		#calender_body {
			margin: 0  0.34rem; 
			.head td{
				font-size: 0.28rem;
				color: #7e8184;
				}
			.head td:hover {
				background-color: #FFFFFF;
				color: #000000;
			}
			.head_circle td{
				.circle{
					width: 0.1rem;
					height: 0.1rem;
					background: red;
					border-radius: 50%;
					position: absolute;
					left: 44%;
    				top: 0.65rem;
				} 
				.cgreen{
					background: green;
				}
				.noGreen{
					width: 0;
					height: 0;
				}
			}
			td {
				-webkit-tap-highlight-color:rgba(0,0,0,0);/*去掉点击时出现的背景高亮*/
				cursor: pointer;
				position: relative; 
				text-align: center; 
				padding:0.1rem 0.2rem; 
				font-size: 0.32rem;
				div{ 
				    width: 0.6rem;
				    height: 0.6rem;
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
				&.now {
					color: dodgerblue;
				}
				
			}
			.cirleRed{
				width: 0.6rem;
			    height: 0.6rem;
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
/*--------------------------------日历控件----------------------------*/
.flex{
    box-sizing: border-box;
    display: -webkit-box;
    -webkit-box-pack: start;
    -webkit-box-align: start;
    display: -webkit-flex;
    -webkit-justify-content: space-between;
    -webkit-align-items: top;
    display: flex;
    justify-content: space-between;
    align-items: top;
    flex-flow:row wrap
}
.flex>div{
    /*margin:0.1rem;
    padding:0.2rem;
    width:25%;
    min-width:300px;
    border: 1px solid #eee;
    border-radius: 2px;
    position: relative;*/
}
.flex>div>span{
    position: absolute;
    left:0px;
    top:0px;
    padding:5px 10px;
    font-family: "PingFang SC","Hiragino Sans GB","STHeiti","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;
    font-size:10px;
    border-radius:0 0 2px 0;
    background:#ea6151;
    color:#fff;
}
.flex>div>input{
    box-sizing: border-box;
    width:100%;
    margin-top:20px;
    border-radius: 2px;
    border:1px solid #dedede;
    padding:10px;
    font-size: 16px;
    background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWwpAZm9udC1mYWNlIHsgZm9udC1mYW1pbHk6IGlmb250OyBzcmM6IHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xNDQyMzczODk2XzQ3NTQ0NTUuZW90PyNpZWZpeCIpIGZvcm1hdCgiZW1iZWRkZWQtb3BlbnR5cGUiKSwgdXJsKCIvL2F0LmFsaWNkbi5jb20vdC9mb250XzE0NDIzNzM4OTZfNDc1NDQ1NS53b2ZmIikgZm9ybWF0KCJ3b2ZmIiksIHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xNDQyMzczODk2XzQ3NTQ0NTUudHRmIikgZm9ybWF0KCJ0cnVldHlwZSIpLCB1cmwoIi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTQ0MjM3Mzg5Nl80NzU0NDU1LnN2ZyNpZm9udCIpIGZvcm1hdCgic3ZnIik7IH0KCl1dPjwvc3R5bGU+PC9kZWZzPjxnIGNsYXNzPSJ0cmFuc2Zvcm0tZ3JvdXAiPjxnIHRyYW5zZm9ybT0ic2NhbGUoMC4wMTU2MjUsIDAuMDE1NjI1KSI+PHBhdGggZD0iTTcxMS4zMDYyIDI5MC42OTcyYzI0LjI4MjEgMCA0NS4zNzY1LTE5LjcwNjkgNDUuMzc2NS00NC4wMzJWNDYuNTYwMjU1OTk5OTk5OTk1YzAtMjQuMzI1MS0yMS4wOTU0LTQ0LjA1MzUtNDUuMzc2NS00NC4wNTM1LTI0LjMwMjYgMC00My45ODggMTkuNzI4NC00My45ODggNDQuMDUzNXYyMDAuMTA0OTZDNjY3LjMxODMgMjcwLjk5MDMgNjg3LjAwMzYgMjkwLjY5NzIgNzExLjMwNjIgMjkwLjY5NzJ6TTYyMy40ODA4IDExMy40MjAzSDQwMC43NjQ5Mjh2NjYuNTEzOTJoMjIyLjcxNTkwNDAwMDAwMDAyVjExMy40MjAyODh6TTg4NC4wNTMgMTEzLjQyMDNoLTgyLjc3NDAxNnY2Ni4xNDUyOGg4NS45NDAyMjRjMjUuMjc4NSAwIDQ2LjYxMTUgMjEuMzc2IDQ2LjYxMTUgNDYuNjc3djE1My45Mjc2OEg5MC40Mzg2NTYwMDAwMDAwMXYtMTUzLjkyNzY4YzAtMjUuMyAyMS4zMzMtNDYuNjc3IDQ2LjYxMTUtNDYuNjc3aDg2LjUwMzQyNFYxMTMuNDIwMjg4aC04Mi42NDI5NDRjLTY0LjA4NiAwLTExNi41MDc2IDUyLjUwODctMTE2LjUwNzYgMTE2LjcwMzJ2Njc2LjgwMTUzNTk5OTk5OTljMCA2NC4xNzQxIDUwLjQ5MTQgMTE2LjY4MDcgMTE0LjU3NzQgMTE2LjY4MDdIODg0LjA1Mjk5MmM2NC4wNjI1IDAgMTE2LjUwNjYtNTIuNTA2NiAxMTYuNTA2Ni0xMTYuNjgwN1YyMzAuMTIzNTE5OTk5OTk5OThDMTAwMC41NTk2IDE2NS45MjkgOTQ4LjExNDQgMTEzLjQyMDMgODg0LjA1MyAxMTMuNDIwM3pNOTMzLjgyOTYgOTEwLjM1MTRjMCAyNS4zLTIxLjMzMyA0Ni42NzYtNDYuNjExNSA0Ni42NzZIMTM3LjA1MDExMTk5OTk5OTk4Yy0yNS4yNzg1IDAtNDYuNjExNS0yMS4zNzYtNDYuNjExNS00Ni42NzZWNDQ2LjQ0NTU2OEg5MzMuODI5NjMyVjkxMC4zNTEzNnpNMjY3LjEwODQgNjQ2LjE4MTljMzYuODc3MyAwIDY2Ljc1MjUtMjkuOTM5NyA2Ni43NTI1LTY2Ljg4MTUgMC0zNi45MjI0LTI5Ljg3NTItNjYuODYxMS02Ni43NTI1LTY2Ljg2MTEtMzYuODU0OCAwLTY2Ljc1MjUgMjkuOTM5Ny02Ni43NTI1IDY2Ljg2MTFDMjAwLjM1NTggNjE2LjI0MjIgMjMwLjI1MjUgNjQ2LjE4MTkgMjY3LjEwODQgNjQ2LjE4MTl6TTUxMS41NDg0IDY0Ni4xODE5YzM2Ljg1NTggMCA2Ni43NTI1LTI5LjkzOTcgNjYuNzUyNS02Ni44ODE1IDAtMzYuOTIyNC0yOS44OTU3LTY2Ljg2MTEtNjYuNzUyNS02Ni44NjExLTM2Ljg3NzMgMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44NjExQzQ0NC43OTU5IDYxNi4yNDIyIDQ3NC42NzExIDY0Ni4xODE5IDUxMS41NDg0IDY0Ni4xODE5ek0yNjUuOTE2NCA4OTAuNzA5YzM2Ljg3NzMgMCA2Ni43NTE1LTI5LjkzOTcgNjYuNzUxNS02Ni44NjExIDAtMzYuOTQyOC0yOS44NzQyLTY2Ljg4MjYtNjYuNzUxNS02Ni44ODI2LTM2Ljg1NTggMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44ODI2QzE5OS4xNjM5IDg2MC43NjkzIDIyOS4wNTk2IDg5MC43MDkgMjY1LjkxNjQgODkwLjcwOXpNNTExLjU0ODQgODkwLjcwOWMzNi44NTU4IDAgNjYuNzUyNS0yOS45Mzk3IDY2Ljc1MjUtNjYuODYxMSAwLTM2Ljk0MjgtMjkuODk1Ny02Ni44ODI2LTY2Ljc1MjUtNjYuODgyNi0zNi44NzczIDAtNjYuNzUyNSAyOS45Mzk3LTY2Ljc1MjUgNjYuODgyNkM0NDQuNzk1OSA4NjAuNzY5MyA0NzQuNjcxMSA4OTAuNzA5IDUxMS41NDg0IDg5MC43MDl6TTc1NS42NDEzIDY0Ni4xODE5YzM2Ljg1NjggMCA2Ni43NTM1LTI5LjkzOTcgNjYuNzUzNS02Ni44ODE1IDAtMzYuOTIyNC0yOS44OTY3LTY2Ljg2MTEtNjYuNzUzNS02Ni44NjExLTM2Ljg3NzMgMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44NjExQzY4OC44ODk5IDYxNi4yNDIyIDcxOC43NjQgNjQ2LjE4MTkgNzU1LjY0MTMgNjQ2LjE4MTl6TTMxMS43MDM2IDI5MC42OTcyYzI0LjI4MTEgMCA0NS4zNzY1LTE5LjcwNjkgNDUuMzc2NS00NC4wMzJWNDYuNTYwMjU1OTk5OTk5OTk1YzAtMjQuMzI1MS0yMS4wOTQ0LTQ0LjA1MzUtNDUuMzc2NS00NC4wNTM1LTI0LjMwMTYgMC00My45ODkgMTkuNzI4NC00My45ODkgNDQuMDUzNXYyMDAuMTA0OTZDMjY3LjcxNDYgMjcwLjk5MDMgMjg3LjQwMiAyOTAuNjk3MiAzMTEuNzAzNiAyOTAuNjk3MnoiIGZpbGw9IiM1ZTdhODgiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==) no-repeat 8px 10px;
        padding-left: 36px;
        color:#666;
}

/*transition*/
.fade-enter-active,
.fade-leave-active {
    transition: all .5s ease-in-out;
}
.fade-enter,.fade-leave-active{
    opacity: 0;
    transform: translateY(-10px);

}

/*下拉框*/
.calendar-dropdown{
    background: #fff;
    position: absolute;
    left:0;
    top:0;
    padding:20px;
    border: 1px solid #eee;
    border-radius: 2px;
}
.calendar-dropdown:before {
    position: absolute;
    left:30px;
    top: -10px;
    content: "";
    border:5px solid rgba(0, 0, 0, 0);
    border-bottom-color: #DEDEDE;
}
.calendar-dropdown:after {
    position: absolute;
    left:30px;
    top: -9px;
    content: "";
    border:5px solid rgba(0, 0, 0, 0);
    border-bottom-color: #fff;
}

/*弹出框*/
.calendar-dialog{
    position: absolute;
    left:0;
    top:0;
    right:0;
    bottom:0;
}

.calendar-dialog-mask{
    background:rgba(255,255,255,.5);
    width:100%;
    height:100%;
}

.calendar-dialog-body{
    background: #fff;
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    padding:20px;
    border: 1px solid #eee;
    border-radius: 2px;
}
</style>