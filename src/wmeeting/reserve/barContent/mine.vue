<template>
  <div class="mine">  
  	<div class="mine_main" v-if="mineshow">
		<ul class="mine_ul">
			<li v-for="(item, index) in minelist" :key="index">
				<div class="mine_cont">
					<div class="mine_title">
						<p class="title_name">{{item.theme}}</p>
						<!-- <p class="title_name">取消预约取消预约取消预约取消预约取消预约取消预约取消预约</p> -->
						<p class="mine-p mine_both">{{item.start_at}} 至 {{item.endTime}}</p>
						<p class="mine-p mine_bottom"><span>{{item.room_name}}</span></p>
					</div>  
					<el-button :disabled="isDisable" type="primary" class="mine_cancle" @click="cancle(item.id)">取消预约</el-button>
					<!-- <button  class="mine_cancle" @click="cancle(item.id)">取消预约</button> -->
				</div>
			</li>
			
		</ul>
		<div style="width: 100%;height: 2.5rem;"></div>
	</div>
	<div v-else>
		<div class="noBook">暂无会议室预约</div>
	</div>
	<!-- <div class="ceshi" @click="abc">测试链接</div> -->
  	<keep-alive> 
	      <tabBar :iscurNum = "iscurNum" ></tabBar>
	   </keep-alive> 
  </div>
</template>
<script> 
import tabBar  from '@/wmeeting/reserve/tabBar'
import NProgress from 'nprogress'
import {getUserId} from '@/utils/auth'
import { mineInfo,cancleInfo} from '@/api/meeting'

export default { 
	name:'mine',
  data () {
    return {
		isDisable:false,
		mineshow:true,
		mineInfo:{ 
			// user_id: '063036370033478821',
			user_id:getUserId(),
		},
		// user_id:'063036370033478821' ,
		user_id:getUserId(),		
		minelist:[],
		// endTime:'',
        iscurNum: 2,
    }
  }, 
  components: {
	//tab子组件 
	  tabBar 
 },
  mounted() {
    NProgress.done()  
  },
  created() {  
		this.setTitle('我的预约');
		this.getMine();	
  }, 
  methods: { 
	  abc(){
		  this.$router.push('/aaa');
	  },
		// 取消
		cancle(id){ 
			this.isDisable = true; 
			cancleInfo(id,this.user_id).then(res => {
					// console.log(res) 
				if (res.result === 'success') {
					this.$router.push('/cancle');
					this.getMine();	
				}else{
					// this.$message({
					// 	message: res.data.errmsg,
					// 	type: 'warning'
					// });
				}
				this.isDisable = false;				
     		 })
			console.log(id)
		},
		// 获取信息
		getMine(){
			mineInfo(this.mineInfo).then(res => {
					// console.log(res) 
				if (res.result === 'success') {
					const data = res.data; 
					this.minelist = res.data;
					
					
					if (this.minelist.length > 0) {
						this.mineshow = true;	
						this.minelist.map((item, index) => { 
							this.$set(item, 'endTime', item.end_at.split(" ")[1]); 
						});					
					} else {
						this.mineshow = false;
					}
					console.log(data)	
				}else{

					// this.$message({
					// 	message: '获取信息失败',
					// 	type: 'warning'
					// });
				}
      })
		},
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
.mine{
	.ceshi{
		position: fixed;
		right: -35px;
		top: 1rem;
		color: #cfcfcf;
		font-size: 12px;
		opacity: 0.5
	}
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
	.mine_main{
		height: 100%;
		-webkit-overflow-scrolling: touch;
		// overflow-scrolling: touch;
		overflow-y: scroll;
		.mine_ul{
			li{
				width: 100%;
				background: #ffffff;
				margin: 0.1rem 0;
				.mine_cont{
					position: relative;
					margin:0 0.32rem;
					.mine_cancle{
							padding: 0.15rem;
							background: #3296fa; 
							color: #ffffff;
							font-size: 0.26rem;
							border-radius: 8px;
							float: right;
							margin-bottom: 0.4rem;
							position: absolute;
							right: 0;
							bottom: 0;
							outline: none;
							border:none;
						}
					.mine_title{
						.title_name{
							font-size: 0.34rem;
							color: #191f25;
							padding-top: 0.38rem;
							line-height: .5rem;
							font-weight: bold;
							background-image: url(../../image/huiyitx.png);/*设置小图标*/ 			
							background-position: 0 0.46rem;/*小图标的位置*/				
							background-repeat: no-repeat;/*背景小图标不重复*/
							background-size: 0.4rem 0.4rem;				
							padding-left: 0.64rem;/*设置内边距*/ 
						}
						.mine-p{
							font-size: .3rem;
							color: #666666;
							margin-left: .64rem;
						}
						.mine_both{
							margin: .4rem  0 .27rem 0.64rem;
						}
						.mine_bottom{
							padding-bottom: .37rem;
						
						}
						
					}
				}
			}
		}
	}
}

</style>  

