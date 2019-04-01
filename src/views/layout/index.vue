<template>
  <div class="layout" v-loading.fullscreen.lock="!ready">
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
  import { config, dingAuth } from '@/utils/config'

  export default {
    name: 'layout',
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
      // this.$store.dispatch('SetPageLoading', true)
    },
    methods: {
      scrollTo(y) {
        this.$refs['vs'].scrollTo({
          x: 0,
          y: y
        })
      }
    },
    created() {
      config()
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
}
html, body {
  width: 100%;
  height: 100%;
  #app {
    height: 100%;
    .layout {
      height: 100%;
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

