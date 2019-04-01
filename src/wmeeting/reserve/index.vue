<template>
  <div class="reserve"> 
  	<div class="tabBar"> 
		<keep-alive> 
	        <component  v-bind:is="tabView"></component>
	    </keep-alive> 
  		<div class="radio-group" v-model="tabView"> 
	        <span v-for="(tab ,index) in tabs" :key="index" :class="{cur:iscur==index}" @click="iscur=index,tabChange('select' + (index + 1))">{{tab.name}}</span>
	    </div> 
		      
  	</div>
  </div>
</template>
<script>
import select1  from './barContent/room.vue';
import select2  from './barContent/meeting.vue';
import select3  from './barContent/my.vue';  
export default { 
  data () {
    return {
      tips:'我们需要',
      tabView: 'select1',
      tabs: [{name: "预定"}, {name: "会议"} ,{name: "开发"}],
      iscur: 0,
      address:'简历请投',
      email:'hjsczhaopin@arcplus.com.cn',
      title:'公司地址',
      comAddress:'上海静安区恒丰路329号隆宇国际商务广场12楼/6楼'
    }
  },
  components: {
  	//tab子组件
    select1,
    select2,
    select3, 
  },
  created() { 
  	//获取地址栏传参
  	this.tabView = 'select1';
  	this.iscur = 0;
  	//隐藏微信底部栏（待验证）
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {  
		WeixinJSBridge.call('hideToolbar');
        WeixinJSBridge.call('hideOptionMenu');
	});
  },
  methods: {
  	//tab切换
    tabChange(tab){
      this.tabView = tab;
    }
  }
}
</script>

<style lang='less' scoped> 
.reserve{ 
	height: 100%;
	.tabBar{
		.radio-group{
			line-height:1.2rem ;
			height: 1.2rem; 
			display:flex;
			color: #a3a5a8;
			background: #FFFFFF;
			display:-webkit-flex;
			flex-wrap:nowrap;
			width: 100%;
			position: absolute;
			left: 0;
			bottom: 0;
		}
		.radio-group>span{
			flex: 1;
			-webkit-box-flex: 1;
			cursor:pointer;
			display:block;
			font-size:.22rem;
			text-align:center; 
			background-image: url(../image/yuding.png); 			
			background-position: 50% .2rem;
		    background-size: .48rem .48rem;
		    background-repeat: no-repeat;
		    padding: .3rem 0 0.2rem 0px;
		}
		.radio-group>span:last-child{
			 background-image: url(../image/wode1.png);
		}
		.radio-group>span:nth-child(2){
			background-image: url(../image/huiyi.png);
		} 
		.radio-group>span:nth-child(1).cur{
			color:#008cee;
			background-image: url(../image/yuding1.png);
		}
		.radio-group>span:nth-child(2).cur{
			color:#008cee;
			 background-image: url(../image/huiyi1.png);
		}
		.radio-group>span:nth-child(3).cur{
			color:#008cee;		
			background-image: url(../image/wode.png);	 
		}
	}
}


</style>  

