<template>
  <div class="meeting"> 
		<div class="meeting_top">
			<div class="meeting_main">
				<div class="meeting_dialog" @click="dialogShow">
					<span>{{titleName}}<i class="el-icon-arrow-down" style="margin-left:0.14rem;color:#191f25"></i></span>
					
				</div>
				<div class="dialogS">
					<div class="dialog" v-show="dialogVisible"> 
						<div class="dialog-ul">
							<ul> 
								<!-- <li style="text-align: center;text-indent: 0;">全部
									<i class="el-icon-arrow-up" style="margin-left:0.14rem;color:#191f25"></i>
								</li> -->
								<li  v-for="(item, index) in roomSelect" :key="index"  @click="chooseRome(item,index)"  :class="{'blue':item.active,'uncolor':!item.active}">{{item.name}} 															
									<i v-if="item.name == '全部'" class="el-icon-arrow-up"></i>
									<i :class="{'el-icon-check':item.active,'unactive':!item.active}"></i>	
								</li> 
							</ul>
						</div> 
						<div class="model"></div>
					</div>
				</div>
			</div>
			<div class="meeting_list" v-if="meetingShow">
				<ul> 
					<li v-for="(item, index) in meetinglist" :key="index" v-if="item.distributions.length > 0">
						<div class="meeting_name">
							<div :class="item.is_available?'img_green':'img_red'">{{item.name}}</div>
							<div style="text-align: right;">
								<span :class="item.is_available?'use_show':'use_red'">{{item.is_available?'空闲':'使用中'}}</span>
							</div>
						</div>
						<div class="meeting_content" v-for="(uitem, uindex) in item.distributions" :key="uindex">
							<div class="main">
								<p class="main_time">{{uitem.start_at}} - {{uitem.end_at}}</p>
								<p style="margin-bottom: 0.2rem;" class="main_title">{{uitem.theme}}</p>
								<p class="main_title" style="color: #999999;font-size: 0.26rem;">
									<span>{{uitem.type}}</span>
									<span style="margin: 0 0.2rem;">{{uitem.member_number}}人</span>
									<span>{{uitem.has_external_staff?'有外部人员':'无外部人员'}}</span>
								</p>
								<p class="main_name"><span style="color:#576a95">{{uitem.booker}}</span><span class="border"></span><span>{{uitem.department}}</span></p>
							</div>
						</div>
						
					</li> 
					
				</ul>
			</div>
			<div v-else>
				<div class="noBook">暂无会议室预约</div>
			</div>
			<div style="width: 100%;height: 2.5rem;"></div>
		</div> 
		
		<keep-alive> 
				<tabBar :iscurNum = "iscurNum" ></tabBar>
		</keep-alive> 
	    
  </div>
</template>
<script> 
import tabBar  from '@/wmeeting/reserve/tabBar'
import { distributions } from '@/api/meeting'
import NProgress from 'nprogress'
export default { 
	name:'meeting',
	 components: {
	//tab子组件 
	  tabBar 
 },
  data () {
    return { 
		titleName:'全部',
		meetingShow:true,
        dialogVisible:false,
		iscurNum: 1, 
		active:false,
		meetingInfo:{ 
			room_id: ''
		}, 
		meetinglist:[],
		roomSelect:[
			{id: '',name:'全部'},
			{id: 1,name:'12楼小会议室'},
			{id: 2,name:'12楼大会议室'},
			{id: 3,name:'6楼小会议室（窗）'},
			{id: 4,name:'6楼小会议室（无窗）'},
			{id: 5,name:'6楼大会议室'},
			// {id: 6,name:'6楼小会议室'}
		],
    }
  }, 
  mounted() {
      NProgress.done()  
    },
  created() {
		this.setTitle('会议');
		this.getDistributions();
  	
  }, 
  methods: {
		getDistributions(){
			distributions(this.meetingInfo).then(res => {
					// console.log(res)
				const data = res.data; 
				this.meetinglist = res.data;
				// if (this.meetinglist.length > 0) {
				// 	this.meetingShow = true;
				// } else {
				// 	this.meetingShow = false;					
				// }
				let arrShow = [];
				this.meetinglist.map((item, index) => {
					console.log(item)
					if (item.distributions.length > 0) {
						arrShow.push(item.distributions)						
					}
				})
				if (arrShow.length > 0) {
					this.meetingShow = true;					
				}else{
					this.meetingShow = false;					
				}
				console.log(arrShow)
            })
		},
		// 弹框操作
		dialogShow(){
			this.dialogVisible = true;
		}, 
		// 选择会议室
		chooseRome(item, index) { 
　　　　this.$nextTick(() =>{
　　　　　 	this.roomSelect.forEach(item =>{ 
				this.$set(item, 'active', false);
　　　　　　});
				this.$set(item, 'active', true); 
　　　　	});
			this.dialogVisible = false;
			this.titleName = item.name; 
			this.meetingInfo.room_id = item.id;
			this.getDistributions();
			// console.log(this.dialogVisible)
　　},
		// 改变title
  	setTitle(t) {
		document.title = t;
		var i = document.createElement('iframe');
		i.src = '//m.baidu.com/favicon.ico';
		i.style.display = 'none';
		i.onload = function() {
			setTimeout(function(){
				i.remove();
			}, 9)
		}
		document.body.appendChild(i);
	}  
  	
  	
    }
 } 
</script>

<style lang='less' scoped> 
.meeting{
	position: absolute;
	width: 100%;
	height: 100%;
	.noBook{
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%);
		color: #929292;
    	font-size: 0.4rem;
	}
	.meeting_top{
		height: 100%;
		-webkit-overflow-scrolling: touch;
		// overflow-scrolling: touch;
		overflow-y: scroll;
		.meeting_main{ 
				width: 100%;
				height: 0.8rem;
				background: #ffffff;
				text-align: center;
				font-size: 0.3rem;
				color: #191f25;
				line-height: 0.8rem;
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
						ul{ 
							background: #ffffff;
							li:first-child{
								text-align: center;
							} 
							li{
								width: 100%;
								height: .88rem;
								line-height: .88rem;
								text-align: left;
								text-indent: 0.32rem;
								font-size: 0.3rem;
								color:#191f25;
								border-top: #f7f7f7 .01rem solid;	
								.el-icon-check{
									color: #008cee;
									display: block;
									float: right;
									line-height: .88rem;
									margin-right: 0.32rem;
								}						
							}
						}
						.blue{
							color: #008cee;
						}
						.uncolor{
							  font-size: 0.3rem
						}
						.unactive{
							display: none;
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
 
		}
		.meeting_list{
			width: 100%; 
			// height: 1.08rem;
			// line-height: 1.08rem;
			// background: #ffffff;
			.meeting_name{
				display: flex;
				display: -webkit-box;
				margin-top: 0.2rem;
				margin-bottom: 0.2rem;
				height: 1.08rem;
				line-height: 1.08rem;
				background: #ffffff;
				div{
					flex: 1;
					-webkit-box-flex: 1;
				}
				.img_green,.img_red{
					font-size: 0.34rem;
					color: #191f25;
					background-image: url(../../image/huiyitx.png);/*设置小图标*/ 			
					background-position: 0.32rem 50%;/*小图标的位置*/				
					background-repeat: no-repeat;/*背景小图标不重复*/
					background-size: 0.4rem 0.4rem;				
					padding-left: 0.98rem;/*设置内边距*/ 
				}
				.img_red{
					background-image: url(../../image/ren.png);/*设置小图标*/ 			
				}
				.use_show,.use_red{
					font-size: 0.24rem;
					color: #78c06e;
					padding: 0.1rem 0.2rem;
					border: #78c06e .01rem solid;
					border-radius: 3px; 
					-moz-border-radius: 3px; 
					-webkit-border-radius: 3px;
					margin-right: 0.32rem;
				}
				.use_red{
					border: #ff4141 .01rem solid;
					color: #ff4141;
				}
			}
			.meeting_content{
				width: 100%;
				height: auto;
				background: #ffffff;
				margin-top: 0.1rem;
				.main{
					margin-left: 0.96rem;
					p{
						line-height: 1;
					}
					.main_time{
						font-size: 0.39rem;
						color: #191f25;
						padding-top: 0.39rem;
						margin-bottom: 0.28rem;
					}
					.main_title{
						font-size: .3rem;
						color: #585d61;
						margin-bottom: 0.32rem;
					}
					.main_name{
						font-size: 0.26rem;
						color: #c0c2c4;
						padding-bottom: 0.5rem;
						.border{
							border-left: #ededed 0.02rem solid;
							margin: 0 .3rem;
						}
					}
				}
			}
		}
	}
}

</style>  

