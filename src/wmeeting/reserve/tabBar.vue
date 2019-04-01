<template>
  <div class="reserve"> 
  	<div class="tabBar">  
  		<div class="radio-group">  
	        <span v-for="(tab ,index) in tabs" :key="index" :class="{cur:iscur==index}" @click="iscur=index,tabChange(tab.url)">{{tab.name}}</span>
	    </div> 
		      
  	</div>
  </div>
</template>
<script>   
export default {
	props:['iscurNum'],
  data () {
    return { 
//    tabView: 'select1',
      tabs: [{name: "预定",url:'room'}, {name: "会议",url:'meeting'} ,{name: "我的",url:'mine'}],
      iscur: this.iscurNum, 
    }
  }, 
  created() { 
  	//获取地址栏传参
//	this.tabView = 'select1'; 
  },
  methods: {
  	//tab切换
    tabChange(url){
      this.$router.push(url)
    }
  }
}
</script>

<style lang='less' scoped> 
.reserve{    
	width: 100%;
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 99;
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

