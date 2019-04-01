<template>
  <div class="room" v-if="moblieShow">  
  	<div class="room_main">
  		<div v-for="(item, index) in roomList" :key="index"> 
	  		<div class="room_list"> 
		  			<div class="room_cont">
		  				<div class="room_img">
		  					<!-- <img src="../../image/img.png" /> -->
		  				</div>
		  				<div class="room_name">
		  					<span class="name_one">{{item.name}}</span>
		  					<span class="name_tong">建议坐席{{item.seats}}人</span>
		  					<span class="name_tong name_bott">{{item.location}}</span>
		  				</div>
		  				<div class="name_button" @click="destine(item)">
		  					<span>预定</span>
		  				</div>
		  			</div>
		  			<div class="room_use">
		  				<ul>
		  					<li v-for="(uitem, uindex) in item.devices" :key="uindex">{{uitem}}</li> 
		  				</ul>
		  			</div> 
	  		</div> 
				<vue-scroll :ops="ops">
					<div class="name_time"  style="position: relative;">
						<ul class="timeRange">
							<li v-for="(titem, tindex) in item.available_hours" :key="tindex">
								<span>{{titem.start_at}}
									<div class="sDiv"></div>
								</span> 
								<span :class="titem.is_available?'roomY':'roomNo'">{{titem.is_available?'空闲':'占用'}}</span>
							</li> 
						</ul>   
  			</div> 
    	</vue-scroll>

  		</div>
  		<div style="width: 100%;height: 1.3rem;"></div>
  	</div>
  	<keep-alive> 
	    <tabBar :iscurNum = "iscurNum" ></tabBar>
	</keep-alive> 
  </div>
  <div v-else>
		<div class="noBook">请在手机上查看预定会议室！</div>
  </div>
</template>
<script> 
import tabBar  from '@/wmeeting/reserve/tabBar'
import NProgress from 'nprogress'
import { room } from '@/api/meeting'
import BScroll from 'better-scroll'

export default { 
	name:'room',
  data () {
    return { 
		moblieShow:true,
		showPhone:true,
        iscurNum: 0,
        roomHour:{ 
      		need_available_hours: 1
		}, 
		roomList:[],
		 ops: {
          bar: {
            background: '#f7f7f7'
          },
          scrollPanel: {
            scrollingX: true
          }
        }
    }
  }, 
  components: {
	//tab子组件 
	  tabBar 
 },
  mounted() {
	  NProgress.done();
	  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
		//判断是ios用户的时候执行某种操作
		this.showPhone = true;
		} else if (/(Android)/i.test(navigator.userAgent)) {
		//判断是安卓用户的时候执行某种操作
		this.showPhone = false;

		}   
   },
  created() { 
  	this.setTitle('会议室预约');
	this.getRoom();
	//   this.browserRedirect();
  }, 
  methods: { 
	  touchend(i){
		//   setTimeout(() => {
		//  this.picScroll = undefined
		//  }, 5000);
	  },
	touchstart(i){
		setTimeout(() => {
		 this.picScroll = undefined
		 }, 8000);
		//  this.picScroll = undefined;

	this.$nextTick(()=>{
		setTimeout(() => {
			let divs= this.$refs.picWrapper 
			console.log(divs)
			let picWidth = 120; //这里是设置每张图片的宽度
			let margin = 6;
			console.log(i)
			//width是所有图片的宽度和以及margin的大小和
			let width = (picWidth + margin)* 9 - margin;
					// for(let i =0 ;i<this.$refs.picWrapper.length;i++){
						console.log(divs[i])
						// console.log(divs[0].style)
						console.log(typeof  divs[i].children)
					divs[i].children[0].style.width = width + 'px'; //设置.pic-list的宽度的宽度
						this.$nextTick(()=>{
						if(!this.picScroll){
							this.picScroll = new BScroll(divs[i],{
							scrollX:true,
							click:true,
							eventPassthrough:'vertical' //忽略竖直方向的滚动
							});
						}else{
							this.picScroll.refresh();
						}
						});

						console.log(this.picScroll)


					// }
		}, 1000);
		})
		
	},  


	  //判断是否为pc、移动端
	browserRedirect() {
		var sUserAgent = navigator.userAgent.toLowerCase();
		var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
		var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
		var bIsMidp = sUserAgent.match(/midp/i) == "midp";
		var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
		var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
		var bIsAndroid = sUserAgent.match(/android/i) == "android";
		var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
		var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
		if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
			//移动端
				this.moblieShow = true;
		} else {
			//pc端
				this.moblieShow = false;
		}
    },
	//预定
	destine(item){
		// this.$router.push('/book/'+id) 
		this.$router.push({
          path: '/book',
          query: {
			id: item.id,
			name:item.name
          }
        })
	},
  	getRoom(){
  		room(this.roomHour).then(res => {
            // console.log(res)
            const data = res.data;
            this.roomList = res.data;
            console.log(data)
        })
  	},
  	//改变title
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
.noBook{
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%);
		color: #929292;
    	font-size: 0.4rem;
	}
.room{
	position: absolute; 
	width: 100%;
	height: 100%; 
	.room_main{ 
		   height: 100%;
		   -webkit-overflow-scrolling: touch;
			// overflow-scrolling: touch;
			overflow-y: scroll;
			.room_list{ 
					width: 100%;
					margin-top: 0.1rem;
					.room_cont{
						width: 100%;
						height: 1.78rem;
						background: #FFFFFF;
						border-top: #EDEDED 0.01rem solid;
						/*border-bottom: #EDEDED 0.01rem solid;*/
						padding-top: 0.4rem;
						display: flex;
						display: -webkit-flex;
						.room_img{
							width: 1.2rem;
							height: 1.2rem;
							margin-left: 0.32rem;
							img{
								width: 100%;
								height: 100%;
								display: inline-block;
							}
						}
						.room_name{
							margin-left: 0.24rem;
							flex: 1;
							-webkit-box-flex: 1;
							 span{
							 	display: block;
							 }
							 .name_one{ 
							 		font-size: 0.34rem;
							 		color: #222222;
							 		font-weight: bold;
							 		margin-bottom:0.2rem ;
							 }
							 .name_tong{
							 	 font-size: 0.24rem;
							 	 color: #666666;
							 }
							 .name_bott{
							 		margin-top: 0.12rem;
							 } 
						}
						.name_button{
						 	 width: 1.2rem;
						 	 margin-right: 0.32rem;
						 	 span{
							 	 	width: 1.2rem;
							 	 	height: .5rem;
							 	 	line-height: .5rem;
							 	 	text-align: center;
							 	 	color: #FFFFFF;
							 	 	background: #5094f2;
							 	 	font-size: 0.26rem;
							 	 	display: block;
							 	 	border-radius: 5px;
							 	 	cursor: pointer;
						 	 }
						 } 
						 
					}
					.room_use{
						width: 100%;
						background: #FFFFFF;
						height: 1.2rem; 
						ul{
							margin-left: 0.32rem;
							padding-top: 0.15rem; 
							li{
								float: left;
								padding: 0.12rem;
								border: #EDEDED 0.01rem solid; 
								margin-right: 0.1rem; 
								font-size: 0.18rem;
								color: #A1A1A1;
							}
						}
					}
			}
			.name_time{
				 	margin: 0.4rem 0 0 0.32rem;
					height: 1.82rem;
				    touch-action: pan-x; 					 
					.timeRange{ 
						width: 100%;
						overflow-x: scroll;
						// overflow-y: hidden;
						touch-action: pan-x!important; 
						white-space: nowrap;
						li{
							display:inline-block;
    						box-sizing: border-box;
							height: 1.5rem;
							color: #686868;
							/*float: left;*/
							/*width:20%;*/
							span{
								display: inline-block;
								display: block; 
								text-align: center;
								
							}
							.timeShow{
								font-size: 0.18rem;
								color:#686868;
							}
							span:nth-child(even){
								margin-left: 0.06rem;
							}
							.roomY,.roomNo{
								margin-top: 0.16rem;
								font-size: 0.24rem;
								color: #686868;
								width: 1rem;
								height: .6rem;
								line-height: .6rem;
								text-align: center;
								background: #FFFFFF;
								border: #d0d1d5 0.01rem solid; 
							}
							.roomNo{  		 
								background: #F7F7F7;
								// background-image:url(../../image/roomNo.png);   				
								background-repeat: no-repeat; 
								background-size: 100% 100%;	
								color: transparent;

							}
						}
						li:nth-child(even){
							margin-right: 0.2rem;
							span:first-child{
								border-top: 0.01rem solid #666666; 
								line-height: 0.18rem;
								width: 1.3rem;
								margin-left: -0.1rem; 
								color: transparent;
								position: relative;
							}
							span:first-child .sDiv{
								width: 0.02rem;
								height: .2rem;
								right: 0;
								top:-0.1rem;
								position: absolute;
								border-right: #666666 0.01rem solid;
							}
							// span:first-child:after{
							// 	content: "|";
							// 	color: #686868; 
							// 	// margin-right: 4px;
							// }
						}
					}
			}
			.name_timek{
				 	margin: 0.4rem 0 0 0.32rem;
					height: 1.82rem;
				    touch-action: pan-x; 					 
					.timeRange{ 
						width: 100%;
						// overflow-x: scroll;
						// overflow-y: hidden;
						touch-action: pan-x; 
						white-space: nowrap;
						li{
							display:inline-block;
    						// box-sizing: border-box;
							height: 1.5rem;
							color: #686868;
							/*float: left;*/
							/*width:20%;*/
							span{
								display: inline-block;
								display: block; 
								text-align: center;
								
							}
							.timeShow{
								font-size: 0.18rem;
								color:#686868;
							}
							span:nth-child(even){
								margin-left: 0.06rem;
							}
							.roomY,.roomNo{
								margin-top: 0.16rem;
								font-size: 0.24rem;
								color: #686868;
								width: 1rem;
								height: .6rem;
								line-height: .6rem;
								text-align: center;
								background: #FFFFFF;
								border: #d0d1d5 0.01rem solid; 
							}
							.roomNo{  		 
								background: #F7F7F7;
								// background-image:url(../../image/roomNo.png);   				
								background-repeat: no-repeat; 
								background-size: 100% 100%;	
								color: transparent;

							}
						}
						li:nth-child(even){
							margin-right: 0.2rem;
							span:first-child{
								border-top: 0.01rem solid #666666; 
								line-height: 0.18rem;
								width: 1.3rem;
								margin-left: -0.1rem; 
								color: transparent;
								position: relative;
							}
							span:first-child .sDiv{
								width: 0.02rem;
								height: .2rem;
								right: 0;
								top:-0.1rem;
								position: absolute;
								border-right: #666666 0.01rem solid;
							}
							// span:first-child:after{
							// 	content: "|";
							// 	color: #686868; 
							// 	// margin-right: 4px;
							// }
						}
					}
			}
	}
}

</style>  

