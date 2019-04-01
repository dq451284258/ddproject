<template>
  <div class="test-project">
    <div v-show="isready"><h2>is ready</h2></div>
    <h2>{{ userid }}</h2>
    <h2>{{ '签名：'+ dingConfig.signature }}</h2>
  </div>
</template>

<script>
  import store from '@/store'
  import { mapGetters } from 'vuex'
  import { config, dingAuth } from '@/utils/config'

  export default {
    name: 'test',
    data() {
      return {
        isready: false
      }
    },
    created() {
      // config()
      // dingAuth()
    },
    computed: {
      ...mapGetters([
        'ready', 'userid', 'dingConfig'
      ])
    },
    mounted() {

    },
    methods: {

    },
    watch: {
      'ready'(val, oldval) {
        if(val) {
          this.isready = true
        }
      }
    }
  }
</script>

<style lang='less'>
.test-project {
  font-size: 18px;
}
</style>
