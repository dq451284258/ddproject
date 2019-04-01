<template>
	<div class="bookMain">
		<div v-if="bookShow" class="bookShow">
			<div id="bookcalender">
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
										@select="calendar1.select"
										@selectMonth="calendar1.selectMonth"
										@selectYear="calendar1.selectYear">
									</calendar> 
								</div>
						
							</div> 
						</div>
					</div>
				</div>
				<div class="book_tip"> 
					点击小方块进行预约，每个小方块30分钟，一个小时2个小方块
				</div>  
				<div class="book_pieces">
					<div class="pieces">
						<div class="pieces_left">
							<ul>
								<li>09:00</li>
								<li>10:00</li>
								<li>11:00</li>
								<li>12:00</li>
								<li>13:00</li>
								<li>14:00</li>
								<li>15:00</li>
								<li>16:00</li>
								<li>17:00</li>  
							</ul>
						</div>
						<div class="pieces_right">
							<ul>
								<li v-for="(item, index) in timelist" :key="index" :class="{disabled:!item.is_available,blue:item.checked}" @click="selectDate(item,index)">
									<!-- <span :class="checkbox.includes(index)?'blue':'white'"></span> -->
								</li> 
								<!-- <li>1</li>
								<li>2</li> 
								<li>3</li>
								<li>4</li>
								<li>5</li>
								<li>6</li>
								<li>7</li>
								<li>8</li>
								<li>9</li>
								<li>10</li>
								<li>11</li>
								<li>12</li>
								<li>13</li>
								<li>14</li>
								<li>15</li>
								<li>16</li>
								<li>17</li>
								<li>18</li>  -->
							</ul>
						</div>
					</div>
				</div>
				
			</div>
			<div class="dialog" v-show="dialogVisible"> 
				<div class="dialog-ul">
					<div class="dialog_tip">
						<p class="title_book">{{tipAlert}}</p>
						<p class="sure" @click="know">确定</p>
					</div> 
				</div> 
				<div class="model"></div>
			</div>
			<!-- <div style="width: 100%;height: 2rem;"></div> -->
			<div class="sumbit" @click="step">
				<div class="sum_btn">
					<button class="sum_left"  type="primary" >下一步</button>
				</div>
			</div>
		</div>
		<div v-else>
			<div class="confirm">
				<div class="confirm_name">
					<span style="margin-left: 0.32rem;">会议室</span>
					<span style="float: right;margin-right: 0.32rem;">{{name}}</span>
				</div>
				<div class="confirm_name">
					<span style="margin-left: 0.32rem;">会议室时间</span>
					<span style="float: right;margin-right: 0.32rem;">{{time}} - {{lastTime}}</span>
				</div>
				<div class="confirm_name">
					<span style="margin-left: 0.32rem;">合计</span>
					<span style="float: right;margin-right: 0.32rem;">{{hours}}小时</span>
				</div>
				<div class="confirm_main">
					<div class="main_name">会议名称</div>
					<div class="main_textarea">
						<textarea placeholder = "请输入" v-model="bookList.theme"></textarea>
					</div>
				</div>
				<div class="confirm_name" style="margin-top:0">
					<span style="margin-left: 0.32rem;" class="redStart">参会人数</span>
					<span style="float: right;margin-right: 0.32rem;width:2.2rem"> 
						<el-input class="select" v-model="bookList.member_number" @blur="Bulr(bookList)" placeholder="请输入"></el-input>
					</span>
				</div>
				<div class="confirm_name">
					<span style="margin-left: 0.32rem;" class="redStart">会议类型</span>
					<span style="float: right;margin-right: 0.32rem;width:3.6rem">
						<el-select class="select" v-model="bookList.type" placeholder="请选择会议类型">
							<el-option
							v-for="item in optionsName"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</span>
				</div>
				<div class="confirm_name">
					<span style="margin-left: 0.32rem;" class="redStart">外部人员</span>
					<span style="float: right;margin-right: 0.32rem;width:3.3rem">
						<el-select class="select" v-model="bookList.has_external_staff" placeholder="是否有外部人员">
							<el-option
							v-for="item in optionsType"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</span>
				</div>
				<div v-show="show" style="height:5rem"></div>
			</div> 
			<!-- pc -->
			<div v-if="show">
				<div class="confirm_sumbit" @click="bespeak">
				<!-- <div class="confirm_sumbit" @click="bespeak"> -->
					<div class="sum_btn">
						<button class="sum_left"  type="primary" >确认预约</button>
					</div>
				</div>
			</div>
			<!-- mobile -->
			<div v-else>
				<div class="confirm_sumbit" @click="bespeak" v-show="isOriginHei">
				<!-- <div class="confirm_sumbit" @click="bespeak"> -->
					<div class="sum_btn">
						<button class="sum_left"  type="primary" >确认预约</button>
					</div>
				</div>
			</div>
		</div>
</div>
</template>
<!--<script>
	window.onload=function(){
		alert(222)
		document.getElementsByClassName("el-input__inner").onclick = funcion(){
			alert(11)
		};
	}
</script>-->
<script> 

 import NProgress from 'nprogress'
import calendar from './calendar.vue'    
import timechange from "@/utils/time";
import {getUserId} from '@/utils/auth' 
import { available,order } from '@/api/meeting'

//import { config, dingAuth } from '@/utils/mobileconfig'
export default {
	 components: {
        calendar
    },
	data() {
		return {
			isOriginHei: true,
			screenHeight: document.documentElement.clientHeight,        
			originHeight: document.documentElement.clientHeight, 
			dialogVisible:false,	
			bookShow:true,	
			show:false,
			tipAlert:'',							
			calendar1:{
                value:[], //默认日期
             	// lunar:true, //显示农历
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
	        date: timechange(new Date()),
			id:getUserId(),		    
			//  id:'063036370033478821',//获取用户信息userid
			timelist:[],
			name:this.$route.query.name,
			time:'',
			lastTime:'',
			hours:'',
			bookList:{
				room_id:this.$route.query.id, 
				start_at:'',   
				end_at:'',   
				member_number:'',   
				type:'',   
				has_external_staff:'',   
				theme:'',   
				//  booker:'063036370033478821',   
				booker:getUserId(),   
			},
			checkbox:[],
			chooseRed:-1,
			optionsName: [{
				value: '0',
				label: '项目会议'
				}, {
				value: '1',
				label: '常规会议'
				}, {
				value: '2',
				label: '重要会议'
				}],
			confirm_name: '',
			optionsType: [{
				value: '0',
				label: '否'
				}, {
				value: '1',
				label: '是'
				}],
			peopleType: '',
			mainList: [], 
			dateList:[],
			value1: '',
			body: '',
			header: '',
			currentYear: '',
			currentMonth: '',
			currentDay: '', 
			allDate:[],
			getYear:'',
			getMonth:'',
			getDay:'',
			num:0,
			num2:0,
		}
	},
	created() {  
		console.log(this.$route.query.id);
		this.isShow();
		this.getTime();
		// 时间格式 
		Date.prototype.format = function(format) {
            var o = {
                "M+": this.getMonth() + 1, //month
                "d+": this.getDate(),    //day
                "h+": this.getHours(),   //hour
                "m+": this.getMinutes(), //minute
                "s+": this.getSeconds(), //second
                "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
                "S": this.getMilliseconds() //millisecond
            }
     	    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,(this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            return format;
        }  
	},
	mounted() { 
		let self = this;
		window.onresize = function() {
			return (function(){
				self.screenHeight = document.documentElement.clientHeight;
			})()
		} 
			
		NProgress.done();
		this.$nextTick(() => {
		    this.$refs.calendar1.$on('select', (value) => {
		    	this.checkbox = []
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
				this.date = this.getYear + '-' + this.getMonth + '-' + this.getDay; 
				this.getTime();
//				console.log(this.addInfo.date)  
		    });
				console.log(this.allDate)  		    
		    this.$refs.calendar1.$on('selectMonth', (month,year) => {
		    	this.checkbox = []
		    	
		    	//选择时间 
				if (month < 10) {
					this.date = year + '-' + '0' + month + '-' + '01';
				} else{
					this.date = year + '-' + month + '-' + '01';
				}   
				this.getTime();
				console.log(month,year)  
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
		isShow() {
			var sUserAgent = navigator.userAgent.toLowerCase();
			var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
			var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
			var bIsMidp = sUserAgent.match(/midp/i) == "midp";
			var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
			var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
			var bIsAndroid = sUserAgent.match(/android/i) == "android";
			var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
			var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
			if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc ||  bIsAndroid || bIsCE || bIsWM) {
				//移动端
				this.show=false;
			} else {
				//pc端
				this.show=true;
			}
		}, 
		Bulr(bookList){
	    	if (!(/^[0-9]*[1-9][0-9]*$/).test(bookList.member_number)) {
	    		this.$message.error('请输入整数，且不能为空');
	    		this.bookList.member_number = ''
	    	}else{
	    		console.log("是")
	    	}
	    },
		know(){
			this.dialogVisible = false;	  
		},
		compare(val1,val2){
			return val1-val2;
		},
		selectDate(item,index){
			console.log(index);
			this.num = index;
			let idx = this.checkbox.indexOf(index);

			if (item.is_available == true) {
			//如果已经选中了，那就取消选中，如果没有，则选中 
				if(idx>-1){ 
					console.log('取消开始执行')
					if (this.num == this.checkbox[0]  ||  this.num == this.checkbox[this.checkbox.length-1]) {
						console.log('允许取消')
						this.checkbox.splice(idx,1); 
						this.$set(item, 'checked', false);
					} else {
						console.log('不允许取消')
						this.$set(item, 'checked', true); 
						this.tipAlert = '请从首尾开始选择取消。'
						this.dialogVisible = true;	  
					}
					
				}else{
					if(this.checkbox.length == 0){
						this.num2 = 0;
					}					
					if(this.num2 == 0){
						this.checkbox.push(index); 
						this.num2++;
						this.$set(item, 'checked', true);
					}else{
						// function compare(val1,val2){
						// 	return val1-val2;
						// }; 
						this.checkbox.sort(this.compare);
						console.log(this.checkbox) ;
						if(this.checkbox[0]-1 == index || this.checkbox[this.checkbox.length-1]+1 == index){
							this.checkbox.push(index); 
							this.$set(item, 'checked', true);
						}else{
							console.log('不连续')
							this.$set(item, 'checked', false);
							this.tipAlert = '只允许选择，连续性的时间块。'
							this.dialogVisible = true; 
						}
					} 

					console.log(this.timelist) 
				}
				
			} 
			

		},
		judgFailTime(a) {
            let x = a // 取得的TextBox中的时间
            let time = new Date(x.replace(/-/g,'/'));
            let b = 30; //分钟数
            time.setMinutes(time.getMinutes() + b, time.getSeconds(), 0);
            return time.format("yyyy/MM/dd hh:mm");

        },
		step(){ 
			
			let checked = false;//要删除的id 
			let newArr = this.timelist.filter(function(obj){
				return checked !== obj.checked;
			});
			//console.log(JSON.stringify(newArr));
		
			console.log(newArr) 
			this.dateList = newArr; 
			if (this.dateList.length > 0 ) {
				this.bookShow = false; 
				
				if (this.dateList.length == 1) {
					this.bookList.start_at = this.date + ' ' + this.dateList[0].start_at;
					this.bookList.end_at  = this.judgFailTime(this.date + ' ' + this.dateList[0].start_at);
					
				} else {
					this.bookList.start_at = this.date  + ' ' +  this.dateList[0].start_at;
					this.bookList.end_at  = this.judgFailTime(this.date + ' ' + this.dateList[this.dateList.length-1].start_at);
				} 
				
				
				this.hours = (30 * (this.dateList.length))/60;
				let last = this.bookList.end_at.split(" ")[1];
				this.time = this.bookList.start_at;
				this.lastTime = last;
//				alert(this.lastTime)
				
//				 let now = new Date(this.bookList.start_at.replace(/-/g,'/'));
////				var now = new Date('2018/11/22 10:30');
//				var time = now.getTime() + 1000*60*30;
//				alert(time)
//				
//				console.log(now)
				
			} else {
				this.$message({
					message: '请选择时间块！',
					type: 'warning'
				});
			}
			
		},
		bespeak(){
			if (this.bookList.member_number&&this.bookList.type&&  this.bookList.has_external_staff &&this.bookList.theme) {
				
			
			if (this.dateList.length > 0) {
				if (this.dateList.length == 1) {
					this.bookList.start_at = this.date + ' ' + this.dateList[0].start_at;
					this.bookList.end_at  = this.judgFailTime(this.date + ' ' + this.dateList[0].start_at);
					
				} else {
					this.bookList.start_at = this.date  + ' ' +  this.dateList[0].start_at;
					this.bookList.end_at  = this.judgFailTime(this.date + ' ' + this.dateList[this.dateList.length-1].start_at);
				} 
				console.log(this.bookList.start_at)
				console.log(this.bookList.end_at)
				// this.approveData.data = JSON.stringify(this.approveData.data);
				// console.log('预约成功')  
				order(this.bookList).then(res => {
					if(res.result === "success"){		  
						// this.approveData.data = JSON.parse(this.approveData.data); 
						this.$router.push('/success')

					}
				})
			} else{
				this.$message.error('请预约！');
			}

			} else {
				this.$message.error('请填写内容');
			}


		},
		// 指定时间块  
		getTime(){
			available(this.$route.query.id,this.date).then(res => {
					// console.log(res) 
				const data = res.data; 
				this.timelist = res.data; 
				this.timelist.map(item=>{
					this.$set(item, 'checked', false);

				})
				console.log(this.timelist)
      		})
		}
	}
}
</script> 
<style lang="less" scoped>    
	@red: red;
	@gray: rgb(248, 248, 248); 
	::-webkit-scrollbar {/*隐藏滚轮*/
		display: none;
	}
	*{
		-webkit-tap-highlight-color: rgba(0,0,0,0);
		-webkit-tap-highlight-color: transparent;
		outline: none;
		:focus { outline: none; } 
	}
	@media screen and (max-width:320px){
		#bookcalender #calender_body td div{
		 	width: 0.5rem!important;
		}
		.sum_left{
			margin-left: 0.1rem!important;
			outline: none;
		}
		.book_tip{
			font-size: 0.18rem!important;
		}
	}
.bookMain{
	position: absolute; 
	width: 100%;
	height: 100%; 
	-webkit-overflow-scrolling: touch;
	// overflow-scrolling: touch;
	overflow-y: scroll;
	.bookShow{
		position: absolute; 
		width: 100%;
		height: 100%; 
		-webkit-overflow-scrolling: touch;
		// overflow-scrolling: touch;
		overflow-y: scroll;
	}
	.confirm{  
		.redStart::before{
			content: "*";
			color: #f56c6c;
			margin-right: 4px
		}
		.confirm_name{
			width: 100%;
			height: 0.92rem;
			background: #ffffff;
			line-height: .92rem;
			font-size: 0.34rem;
			color: #333333;
			margin-top: .32rem;
			
		}
		.confirm_main{
			margin-top: .32rem;
			font-size: 0.34rem;
			color: #333333;
			background: #ffffff;
			border-bottom: #ededee 0.01rem solid;
			.main_name{
				margin: 0 0 0.32rem 0.32rem;
				padding-top: 0.32rem;
			}
			.main_name::before{
				content: "*";
				color: #f56c6c;
				margin-right: 4px;
			}
			.main_textarea{
				margin-left: .55rem;
				padding-bottom: .2rem;
				textarea{
					width: 6.5rem;
					height: .75rem;
					border: none;
					outline: none; 
				}
			}
		}
		
	}
	.confirm_sumbit{ 
			background: #FFFFFF;
			width: 100%;
			height: 1.4rem;
			position: fixed;
			bottom: 0;
			left: 0; 
			display: flex;
			display: -webkit-flex;
			align-items: center;
			.sum_btn{
				flex: 1; 
					button{ 	
						border: 0;
						display: block; 
						height: 0.92rem;
						width: 6.86rem;
						border-radius: 8px;  
						font-size: 0.36rem;
						margin: 0 auto;
						text-align:center;
						outline: 0;
						background: #5094f3;
						color: #FFFFFF;
					} 
					button:focus {outline:none;} /*for IE*/
					button::-moz-focus-inner {border-color: transparent;} /*for mozilla*/	

			}			
		}
	.sumbit{ 
		background: #FFFFFF;
		width: 100%;
		height: 1.4rem;
		position: fixed;
		bottom: 0;
		left: 0; 
		display: flex;
		display: -webkit-flex;
		align-items: center;
		.sum_btn{
			flex: 1; 
				button{
					border: 0;
					display: block; 
					height: 0.92rem;
					width: 6.86rem;
					border-radius: 8px;  
					font-size: 0.36rem;
					margin: 0 auto;
					text-align:center;
					outline: none;
					background: #5094f3;
					color: #FFFFFF;
				} 
		}			
	}
	.dialog{  
		.dialog-ul{
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			overflow: auto;
			z-index: 1000;
			width: 100%;  
			.dialog_tip{
				position: relative;
				margin: 4rem auto;
				width: 80%;
				height: 25%;
				background: #ffffff;
				border-radius: 0.08rem;
				color: #666666;
				.title_book{
					text-align: center;
					padding-top: .8rem;
					font-size: 0.3rem;

				}
				.sure{
					position: absolute;
					right: 5%;
					bottom: 8%;
					width: 1.5rem;
					height: 0.8rem;
					text-align: center;
					color: #ffffff;
					font-size: 0.28rem;
					line-height: .8rem;
					background: #5094f3;
					border-radius:0.08rem; 
				}
			} 
		}
		.model{
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			opacity: .5;
			background: #000;
			z-index: 999;
		}
	}
	#bookcalender { 
		width: 100%;
		height: 100%; 
		-webkit-overflow-scrolling: touch;
		// overflow-scrolling: touch;
		overflow-y: scroll; 
		.book_pieces{
			height: 100%; 
			.pieces{
				display: flex;
				display: -webkit-box;
				margin: .4rem 0 0 0.82rem;
				.pieces_left{
					width: 0.88rem;
					 ul{
						 li{
							 height: 1rem;
							 line-height: 0.9rem;
						 }
					 }
				}
				.pieces_right{
					flex: 1;
					-webkit-box-flex: 1;
					ul{ 
						position: relative;
						.white{
							background: #FFFFFF; 
						}
						.disabled{
							background: #e1e1e1; 
						}
						.blue{
							background: #5094f2
						}
						li{ 
							position: absolute;
							display: block;
							width: 2rem;
							height: .8rem;
							line-height: .8rem;
							background: #FFFFFF; 
							border: #ededed 0.01rem solid;
							border-radius: 0.08rem; 
							span{
								width: 100%;
								height: 100%;
								display: block;
							} 
						}						
						li:nth-child(1){left: 0;top: 0}  li:nth-child(2){left: 2.35rem;top: 0} 
						li:nth-child(3){left: 0;top: 1rem;} li:nth-child(4){left: 2.35rem;top: 1rem;}
						li:nth-child(5){left: 0;top: 2rem;} li:nth-child(6){left: 2.35rem;top: 2rem;}
						li:nth-child(7){left: 0;top: 3rem;} li:nth-child(8){left: 2.35rem;top: 3rem;} 
						li:nth-child(9){left: 0;top: 4rem;} li:nth-child(10){left: 2.35rem;top: 4rem;}
						li:nth-child(11){left: 0;top: 5rem;} li:nth-child(12){left: 2.35rem;top: 5rem;}
						li:nth-child(13){left: 0;top: 6rem;} li:nth-child(14){left: 2.35rem;top: 6rem;}
						li:nth-child(15){left: 0;top: 7rem;} li:nth-child(16){left: 2.35rem;top: 7rem;}
						li:nth-child(17){left: 0;top: 8rem;} li:nth-child(18){left: 2.35rem;top: 8rem;}

					 }
				}
			}
			
		}
		.book_tip{
			background: #5094f2;
			font-size: .24rem;
			color: #FFFFFF;
			text-align: center;
			height: .72rem;
			line-height: .72rem;
		}   
		.time{
			font-size: .34rem; 
		    margin-top: 0.1rem;
		    color: #666666;
		}
		.workSome{
			font-size: 0.34rem;
			margin-left: 0.8rem;
			color: #666666;
		}
		.border{
			border: #ededed 0.01rem solid;
			margin: 0.16rem 0.75rem 0.34rem 0.8rem;
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
			margin: 0.4rem 0 0rem 0.8rem;
		}
		position: relative;
		font-size: 0.24rem; 
		font-family: "微软雅黑";  
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
}	
</style>
<style lang="less">
.confirm_name{
	.select {
		.el-input__inner{
			border: none;
			text-align: right;
		}
	}
}

</style>
