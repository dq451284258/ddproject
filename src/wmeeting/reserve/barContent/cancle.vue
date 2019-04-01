<template>
  <div class="cancle">
        <div class="tip">
            <div class="cancle_img">
                <img src="../../image/qxcg.png" alt="">
            </div>
            <div class="title">取消成功</div>            
        </div>   
  </div>
</template>
<script>  
import NProgress from 'nprogress'  

export default { 
	name:'cancle',
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
.cancle{
	position: absolute; 
	width: 100%;
    height: 100%;
    .tip{ 
        margin-top: 2.18rem; 
        .cancle_img{
            margin: 0 auto;
            text-align: center;
            width: 1.6rem;
            height: 1.6rem;
            img{
                width: 100%;
                height: 100%;
                display: block;
            }
            
        }
        .title{
                color: #666666;
                font-size: .48rem;
                margin-top: .48rem;
                text-align: center;
            }
    } 
}

</style>  

