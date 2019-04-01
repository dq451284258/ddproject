<template>
  <div class="workHour">
   <transition name="fade-transform" mode="out-in">
		 		<div v-loading="tableLoading">
					<div class="work_set"  v-if="show">
						<div @click="go('/write')">
						<ul>
							<li class="work_img"></li>
							<li>工时填写</li>
						</ul>	  		
					</div>
					<div @click="go('/examine')">
						<ul>
							<li class="work_img1">
								<span class="redTip">{{num}}</span> 
							</li>
							<li>工时审批</li>
						</ul>
					</div>
					<div  @click="go('/export')">
						<ul>
							<li class="work_img2"></li>
							<li>报表导出</li>
						</ul>
					</div>
					<!-- <span style="color: transparent;font-size: 18px;position: absolute;right: 0;" @click="go('/moblieWrite')">测试链接</span> -->
				</div>
				<div class="work_moblie"  v-else>
					<div class="write" @click="go('/moblieWrite')">
						<ul>
							<li class="work_img"></li>
							<li style="margin-top: 0.2rem;">工时填写</li>
						</ul>	  		
					</div>  
					<div class="examine" @click="go('/moblieExamine')">
						<ul>
							<li class="work_img1">
								<span class="redTip" style="top: 0.6rem;right: 4.85rem;">{{num}}</span>
							</li>
							<li style="margin-top: 0.2rem;">工时审批</li>
						</ul>
					</div> 
				</div>
			</div>
    </transition>

  </div>
</template>

<script>
import Vue from 'vue'
import 'vx-ui/lib/style/theme/index.css'
import {flex} from './flexible.js'
import VxUI from 'vx-ui'
import NProgress from 'nprogress'
import store from '@/store'
// import { config, dingAuth } from '@/utils/mobileconfig'
import timechange from "../utils/time";
import {getUserId} from '@/utils/auth'
import {list,approve} from '@/api/work'
Vue.use(VxUI)
export default { 
  name: 'workHour',
  data() {
    return { 
			show:true,
			num:'',
      tableLoading: false,			
    	listData:{
	  		approveid:getUserId(),
	    	// approveid:'063036370033478821',
				// approveid: this.$store.getters.userid,
        type:'1',
        startdate: timechange(new Date(new Date().getFullYear(), new Date().getMonth()-1, 1)),//上个月第一天
        enddate: timechange(new Date()), //当天
				keyword:'',  
	  	},
    }
  },
  created() {
  	// config();
		// dingAuth();
		  
    
		
  },
  mounted() { 
		NProgress.done();  	
		this.getList();
		this.browserRedirect(); 
		this.fit();
   },
  methods: {  
  	getList() { 
        this.tableLoading = true

	        list(this.listData).then(res => {
						if (res.code === 1) {
							 this.tableLoading = false

	            // console.log(res)
	            const data = res.data;
	            this.num = data.length;
//	            console.log(data)
						}
       
	        })	         
	     },
    //适配
	    fit(){
	        flex();
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
             this.show=false;
        } else {
            //pc端
             this.show=true;
        }
    },
    go(url) {
        this.$router.push(url)
    },
  }
}
</script> 
<style lang="less"> 
.workHour{   
	overflow: hidden;
	ul,li{
		list-style: none;
		padding: 0;
		margin: 0;
	}	
	.redTip{
    background-color: #f56c6c;
    border-radius: 50%;
    color: #fff;
    display: inline-block;
    font-size: 12px;
    height: 15px;
    line-height: 15px;
    padding: 0 4px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid #fff;
    position: absolute;
    top: -5px;
    right: -5px;
	}
	.work_set{
		padding: 45px 0 0 20px;
		div{
			width: 160px;
			height: 60px;
			line-height: 60px;
			float: left;
			background: #FFFFFF;
			margin-right: 20px;
			border-radius: 5px;
			text-align: center;
			ul li{ 
				height: 40px; 
				float: left;
			}
			.work_img,.work_img1,.work_img2{ 
				background: url(image/tian.png); 
			    background-repeat: no-repeat; 
			    background-size: 100% 100%;
			    width: 38px;
			    height: 39px; 
			    margin: 10px;
			}
			.work_img1{
				background: url(image/shen.png); 
				position: relative;
			}
			.work_img2{
				background: url(image/dao.png); 
			}
		}
		
	}
	.work_moblie{
		font-size: 0.22rem;
		color: #666666;
		margin: 0.72rem 0 0 0.46rem;
		display: flex;
		display: -webkit-box;
		.write{
			width: 1.9rem;
		}
		.examine{
			flex: 1;
			-webkit-box-flex: 1;
			
		}
		.work_img,.work_img1{ 
			background: url(image/wirte.png); 
	    background-repeat: no-repeat; 
	    background-size: 100% 100%;
	    width: 0.96rem;
	    height: 0.96rem;  
		}
		.work_img1{
			background: url(image/shenpi.png);
			background-repeat: no-repeat; 
	    background-size: 100% 100%; 
		}
	}
}


</style>
<style lang="less">
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
	}
	.el-loading-parent--relative{
			.redTip{
				top:-0.13rem!important;
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
