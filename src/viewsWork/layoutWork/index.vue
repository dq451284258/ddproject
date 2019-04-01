<template>
  <div class="layoutWork" v-loading.fullscreen.lock="!ready">
    <vue-scroll :ops="ops" ref="vs">
      <transition name="fade-transform" mode="out-in">
        <router-view v-if="ready"></router-view>      
      </transition> 
    </vue-scroll>
  </div>
</template>

<script>
  import store from '@/store'
  import { mapGetters } from 'vuex'
  import { config, dingAuth } from '@/utils/mobileconfig' 
  import {getUserId} from '@/utils/auth'
  import {flex} from '../flexible.js'
  import NProgress from 'nprogress'
  import Vue from 'vue'
  import 'vx-ui/lib/style/theme/index.css' 
  import VxUI from 'vx-ui'
  Vue.use(VxUI)
  export default {
    name: 'layoutWork',
    data() {
      return { 
        ops: {
          bar: {
            background: '#c1c1c1'
          },
          scrollPanel: {
            scrollingX: false
          }
        }
      }
    },
    computed: {
      ...mapGetters([
        'ready', 'pageLoading'
      ])
    },
    mounted() {
      NProgress.done()  
    },
    methods: { 
      scrollTo(y) {
        this.$refs['vs'].scrollTo({
          x: 0,
          y: y
        })
       },
      //适配
	    fit(){
	        flex();
	    },
    },
    created() {
      config() 
      this.fit()
    },
    watch: {
      $route(val,oldval) {
        this.scrollTo(0)
      }
    }
  }
</script>

<style lang='less'>
* {
  box-sizing: border-box;
  -webkit-tap-highlight-color:rgba(255,0,0,0);
  touch-action: pan-y; 
  font-family: "微软雅黑";
  margin: 0;
  padding:0;
  ul,li{
  	list-style: none;
  } 
}
.layoutWork{
  position:relative;
	width:100%;
	height:100%;
	top:0;
	left:0; 
	background-color:#f6f6f6;
	font-size: 14px;
}
html, body {
  width: 100%;
  height: 100%;
  #app {
    height: 100%;
    .layoutM {
      height: 100%;
      background: #f7f7f7;
    }
  }
}

 
//globl transition css

/*fade*/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.28s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

/*fade-transform*/
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .5s;
}
.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/*breadcrumb transition*/
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all .5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all .5s;
}

.breadcrumb-leave-active {
  position: absolute;
}

#nprogress .spinner {
  display: none;
}
</style>

