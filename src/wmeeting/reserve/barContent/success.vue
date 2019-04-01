<template>
  <div class="success">
        <div class="success_tip">
            <div class="success_img">
                <img src="../../image/yycg.png" alt="">
            </div>
            <div class="success_title">预定成功</div>            
        </div>   
  </div>
</template>
<script>  
import NProgress from 'nprogress'  

export default { 
	name:'success',
  data () {
    return { 
    }
  },  
  mounted() {
    NProgress.done()  
  },
  created() {  
    this.setTitle('会议室预约'); 
    window.setTimeout(() => { 
        this.$router.push('/mine')
    }, 1000);
  }, 
  methods: {  
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
.success{
	position: absolute; 
	width: 100%;
    height: 100%;
    .success_tip{ 
        margin-top: 1.76rem; 
        .success_img{
            margin: 0 auto;
            text-align: center;
            width: 3.62rem;
            height: 2.44rem;
            img{
                width: 100%;
                height: 100%;
                display: block;
            }
            
        }
        .success_title{
                color: #666666;
                font-size: .48rem;
                margin-top: .12rem;
                text-align: center;
            }
    } 
}

</style>  

